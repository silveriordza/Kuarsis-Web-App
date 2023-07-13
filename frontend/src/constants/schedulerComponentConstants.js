/*
CONSTANTS FOR THE SCHEDULER COMPONENT LOGIC.
*/

//When the user scheduled an event, it is marked as RESERVED when is not paid yet.
export const EVENT_STATUS_RESERVED = 'EVENT_STATUS_RESERVED'
//When the user scheduled an event, it is marked as Confirmed when the user has paid it.
export const EVENT_STATUS_CONFIRMED = 'EVENT_STATUS_CONFIRMED'
//When the provider has already met with the user, the event is marked as HELD, becuase the meeting was already held. 
export const EVENT_STATUS_HELD = 'EVENT_STATUS_HELD'
//When either the user or the provider cancel the meeting, it will have status canceled. 
export const EVENT_STATUS_CANCELED = 'EVENT_STATUS_CANCELED'



