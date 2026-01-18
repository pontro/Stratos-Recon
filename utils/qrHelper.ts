import { ScoutingData, StartingZone, MatchType, Alliance } from '../types';

/**
 * Strict positional JSON array compression based on manual v1.
 * Order (REVISED: Timestamp Removed):
 * 0: team_num (Int)
 * 1: match_num (Int)
 * 2: match_type (String)
 * 3: alliance (String)
 * 4: scouter (String)
 * 5: start_zone (Int)
 * 6: auto_active (Int)
 * 7: auto_hang (Int)
 * 8: auto_pts (Int)
 * 9: tele_pts (Int)
 * 10: tele_hang (Int)
 * 11: adv_chasis (Int)
 * 12: adv_intake (Int)
 * 13: adv_shooter (String)
 * 14: adv_climber (Int)
 * 15: adv_trench (Int)
 * 16: adv_hoppercapacity (String|null)
 * 17: adv_broke (Int)
 * 18: adv_fixed (Int)
 */
export const compressScoutingData = (data: ScoutingData): any[] => {
  // 3.1 start_zone mapping
  const zoneMap: Record<StartingZone, number> = {
    [StartingZone.DEPOT]: 1,
    [StartingZone.CENTER]: 2,
    [StartingZone.OUTPOST]: 3
  };

  // 3.3 Match type naming
  const matchTypeMap: Record<MatchType, string> = {
    [MatchType.PRACTICE]: 'Practice',
    [MatchType.QUALIFICATION]: 'Qualification',
    [MatchType.PLAYOFF]: 'Playoff'
  };

  // 3.2 Alliance naming
  const allianceMap: Record<Alliance, string> = {
    [Alliance.RED]: 'Red',
    [Alliance.BLUE]: 'Blue'
  };

  // Hopper capacity mapping
  const hopperMap: Record<number, string | null> = {
    0: '0-20',
    1: '21-40',
    2: '41-60',
    3: '61+',
    [-1]: null
  };

  return [
    parseInt(data.teamNumber, 10) || 0,              // 0: team_num
    parseInt(data.matchNumber, 10) || 0,             // 1: match_num
    matchTypeMap[data.matchType],                    // 2: match_type
    allianceMap[data.alliance],                      // 3: alliance
    data.scouter || 'NA',                            // 4: scouter
    zoneMap[data.startingZone],                      // 5: start_zone
    data.isActiveInAuto ? 1 : 0,                     // 6: auto_active
    data.autoHang ? 1 : 0,                           // 7: auto_hang
    data.autoFuelPoints,                             // 8: auto_pts
    data.teleopFuelPoints,                           // 9: tele_pts
    data.climbLevel,                                 // 10: tele_hang
    data.adv_chasis,                                 // 11: adv_chasis
    data.adv_intake,                                 // 12: adv_intake
    data.adv_shooter.length > 0 
      ? data.adv_shooter.sort((a,b) => a-b).join('-') 
      : "4",                                         // 13: adv_shooter
    data.adv_climber,                                // 14: adv_climber
    data.adv_trench,                                 // 15: adv_trench
    hopperMap[data.adv_hopper_cap] ?? null,          // 16: adv_hoppercapacity
    data.adv_broke,                                  // 17: adv_broke
    data.adv_fixed                                   // 18: adv_fixed
  ];
};