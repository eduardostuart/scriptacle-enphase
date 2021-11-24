// Scriptacle Widget to display the status of a enphase system, 
// including current power production (watts) and energy produced (watts/hourly) today  

// Widget configuration
// the API Key and User id can be created/found here https://developer.enphase.com/
const SYSTEM_ID = "" // The Enlighten ID of the system.
const API_KEY   = ""
const USER_ID   = ""


//

const WIDGET_TITLE = "Solar panels"
const BASE_URL = "https://api.enphaseenergy.com/api/v2"


/**
 * Fetch data from Enphase Energy API
 * 
 * @param {string} key app key
 * @param {string} userId api user id
 * @param {string} systemId 
 * @returns {object} current power, energy generated today and status of solar panels
 */
async function fetchLastReport(key, userId, systemId) {
  const { current_power, energy_today, status } = await new Request(
    `${BASE_URL}/systems/${systemId}/summary?key=${key}&user_id=${userId}`
  ).loadJSON()
  
  return {
    // Current power production, in Watts. For historical requests, returns 0.
    currentPower: current_power,
    // Energy produced on the requested day, in Watt hours.
    energyToday: energy_today,
    // The current status of the system
    status,
  }
}

/**
 * Create a widget list of elements  
 * @param {object} data 
 * @returns {ListWidget}
 */
function createWidget(data) {
  const widget = new ListWidget()
  widget.useDefaultPadding()
  
  // Title
  const title = widget.addText(WIDGET_TITLE)
  title.font = Font.blackSystemFont(20)

  widget.addSpacer(4)

  const status = widget.addText(`Status: ${data.status}`)
  status.font = Font.systemFont(10)
  widget.addSpacer(6)

  const current = widget.addText(`Current power: ${data.currentPower}`)
  current.font = Font.systemFont(10)
  
  widget.addSpacer(6)
  const today = widget.addText(`Energy today: ${data.energyToday}`)
  today.font = Font.systemFont(10)
  
  return widget
}


if (config.runsInWidget) {
  const data = await fetchLastReport(API_KEY, USER_ID, SYSTEM_ID)
  console.log(`Response: ${JSON.stringify(data)}`)
  const widget = createWidget(data)
  Script.setWidget(widget)
}

Script.complete()
