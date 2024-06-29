import React, { useState } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { getDatabase, ref, update } from "firebase/database";
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
        [type]:formatTime(time),
      },
    }));
  };

  const handleSave =  () => {
        
    if( !availability.monday.available && !availability.tuesday.available && !availability.wednesday.available && !availability.thursday.available && !availability.friday.available && !availability.saturday.available && !availability.sunday.available )
        {
            return
        }


        const userid = JSON.parse(localStorage.getItem('adviserid'))

        update(ref(database, 'advisers/' + userid),{
           availability:convertToArray(availability)
     
         });
        // formik.setFieldValue("availability", availability)
        handleClose()
  
  };

  return (
    <Dialog open={open} onClose={handleClose} >
      <DialogTitle>Set Availability</DialogTitle>
      <DialogContent >
        <div>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {daysOfWeek.map((day) => (
            <div key={day.value} className="flex items-center my-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={availability[day.value].available}
                    onChange={() => handleCheckboxChange(day.value)}
                  />
                }
                label={day.label}
                className='w-2/6'
              />

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
