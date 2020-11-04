import React from "react";
import DayListItem from "./DayListItem";

// DayList component - sidebar containing the DayListItem components
export default function DayList(props) {

  const days = props.days.map(day => {
    return (
      <DayListItem 
        key={day.id}
        name={day.name} 
        spots={day.spots} 
        selected={day.name === props.day}
        setDay={props.setDay}  
      />
    );
  })

  return (
    <ul>
      {days}
    </ul>
  );
}