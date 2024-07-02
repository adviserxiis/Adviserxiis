import React, { useEffect, useState } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { get, getDatabase, ref, update } from "firebase/database";
import { app } from "../firebase";
import Swal from 'sweetalert2';

const daysOfWeek = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' }
];

function formatTime(dateString) {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes} ${period}`;
}

const AvailabilitySchedule = ({ open, handleClose}) => { 

  const database = getDatabase(app);
  const [availability, setAvailability] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day.value] = { available: false, startTime: null, endTime: null };
      return acc;
    }, {})
  );

  function convertToArray(schedule) {
    return Object.entries(schedule)
      .filter(([day, details]) => details.available)
      .map(([day, details]) => ({
        id: `${day}-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique ID
        day: day.charAt(0).toUpperCase() + day.slice(1), // Capitalize the day
        timing: `${details.startTime} - ${details.endTime}`
      }));
  }

  function convertToTimeString(timeString) {
    // Create a new Date object with the current date
    const currentDate = new Date();
    const [time, period] = timeString.split(' ');
  
    // Parse the time part (e.g., "12:00")
    let [hours, minutes] = time.split(':').map(Number);
  
    // Adjust hours based on the period (AM/PM)
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
  
    // Set hours and minutes to the currentDate object
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);
  
    // Format the date to the required string format
    const formattedDate = currentDate.toString();
  
    return formattedDate;
  }

  const handleCheckboxChange = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available,
      },
    }));
  };

  const handleTimeChange = (day, type, time) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]:time,
      },
    }));
  };

  const handleSave =  () => {
        
    if( !availability.monday.available && !availability.tuesday.available && !availability.wednesday.available && !availability.thursday.available && !availability.friday.available && !availability.saturday.available && !availability.sunday.available )
        {
            return
        }
 
          console.log("ans", availability)
        // const userid = JSON.parse(localStorage.getItem('adviserid'))

        // update(ref(database, 'advisers/' + userid),{
        //    availability:convertToArray(availability)
     
        //  });
        // formik.setFieldValue("availability", availability)
        handleClose()
  
  };

  function convertToSchedule(arr) {
    // Initialize all days with default values
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const schedule = days.reduce((acc, day) => {
      acc[day] = { available: false, startTime: null, endTime: null };
      return acc;
    }, {});
  
    // Update the schedule based on the input array
    arr.forEach(({ day, timing }) => {
      const [startTime, endTime] = timing.split(' - ');
      const startTimeString = convertToTimeString(startTime)
      const endTimeString = convertToTimeString(endTime)
      const dayKey = day.toLowerCase();
      if (schedule[dayKey]) {
        schedule[dayKey] = { available: true, startTimeString, endTimeString };
      }
    });
  
    return schedule;
  }

  async function getAdviser(userId) {
    const nodeRef = ref(database, `advisers/${userId}`);
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log('No data available');
        return null;
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return null;
    }
  }

  useEffect (()=>{
    const userid = JSON.parse(localStorage.getItem('adviserid'))
    const adviser = getAdviser(userid).then((result)=>{
      // console.log("adviser", convertToSchedule(result.availability))
      // console.log("avalibilty")
      setAvailability( convertToSchedule(result.availability))
    })
  },[])

  return (
    <Dialog open={open} onClose={handleClose} >
      <DialogTitle>Set Availability</DialogTitle>
      <DialogContent >
        <div>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {daysOfWeek.map((day) => (
            <div key={day.value} className="flex items-center my-2 ">
              <div  className='w-2/6 break-words' style={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={availability[day.value].available}
                    onChange={() => handleCheckboxChange(day.value)}
                  />
                }
                label={day.label}
               
                // style={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}
              />
              </div>

                              <div className="w-4/6 flex items-center space-x-2">
                  <TimePicker
                    label="Start Time"
                    value={availability[day.value].startTime}
                    onChange={(time) => handleTimeChange(day.value, 'startTime', time)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <TimePicker
                    label="End Time"
                    value={availability[day.value].endTime}
                    onChange={(time) => handleTimeChange(day.value, 'endTime', time)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
            </div>
          ))}
        </LocalizationProvider>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvailabilitySchedule;
