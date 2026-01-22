import { ScoutingData, StartingZone, MatchType, Alliance } from '../types';

/**
 * Strict Positional QR Code Compression
 * Matches CSV Export Format Exactly.
 * 
 * Column Order:
 * 0: timestamp (Always empty string "")
 * 1: team_num
 * 2: match_num
 * 3: match_type
 * 4: alliance
 * 5: scouter
 * 6: start_zone
 * 7: auto_active
 * 8: auto_hang
 * 9: auto_pts
 * 10: auto_comm
 * 11: tele_pts
 * 12: tele_comm
 * 13: tele_hang (climbLevel)
 * 14: adv_role
 * 15: adv_broke
 * 16: adv_fixed
 * 17: adv_chasis
 * 18: adv_intake
 * 19: adv_shooter
 * 20: adv_climber
 * 21: adv_hoppercapacity
 * 22: adv_trench
 * 23: adv_comments (comments)
 */
export const compressScoutingData = (data: ScoutingData): any[] => {
  // Mappings
  const zoneMap: Record<StartingZone, number> = {
    [StartingZone.DEPOT]: 1,
    [StartingZone.CENTER]: 2,
    [StartingZone.OUTPOST]: 3
  };

  const matchTypeMap: Record<MatchType, string> = {
    [MatchType.PRACTICE]: 'Practice',
    [MatchType.QUALIFICATION]: 'Qualification',
    [MatchType.PLAYOFF]: 'Playoff'
  };

  const allianceMap: Record<Alliance, string> = {
    [Alliance.RED]: 'Red',
    [Alliance.BLUE]: 'Blue'
  };

  const hopperMap: Record<number, string | null> = {
    0: '0-20',
    1: '21-40',
    2: '41-60',
    3: '61+',
    [-1]: null
  };

  return [
    "",                                              // 0: timestamp (Empty)
    parseInt(data.teamNumber, 10) || 0,              // 1: team_num
    parseInt(data.matchNumber, 10) || 0,             // 2: match_num
    matchTypeMap[data.matchType],                    // 3: match_type
    allianceMap[data.alliance],                      // 4: alliance
    data.scouter || 'NA',                            // 5: scouter
    zoneMap[data.startingZone],                      // 6: start_zone
    data.isActiveInAuto ? 1 : 0,                     // 7: auto_active
    data.autoHang ? 1 : 0,                           // 8: auto_hang
    data.autoFuelPoints,                             // 9: auto_pts
    data.autoComments || '',                         // 10: auto_comm
    data.teleopFuelPoints,                           // 11: tele_pts
    data.teleopComments || '',                       // 12: tele_comm
    data.climbLevel,                                 // 13: tele_hang
    data.adv_field_role,                             // 14: adv_role
    data.adv_broke,                                  // 15: adv_broke
    data.adv_fixed,                                  // 16: adv_fixed
    data.adv_chasis,                                 // 17: adv_chasis
    data.adv_intake,                                 // 18: adv_intake
    data.adv_shooter.length > 0
      ? data.adv_shooter.sort((a, b) => a - b).join('-')
      : "4",                                         // 19: adv_shooter
    data.adv_climber,                                // 20: adv_climber
    hopperMap[data.adv_hopper_cap] ?? null,          // 21: adv_hoppercapacity
    data.adv_trench,                                 // 22: adv_trench
    data.comments || ''                              // 23: adv_comments
  ];
};

export const decompressScoutingData = (data: any[]): Partial<ScoutingData> => {
  // Reverse Maps
  const reverseZoneMap: Record<number, StartingZone> = {
    1: StartingZone.DEPOT,
    2: StartingZone.CENTER,
    3: StartingZone.OUTPOST
  };

  const reverseMatchTypeMap: Record<string, MatchType> = {
    'Practice': MatchType.PRACTICE,
    'Qualification': MatchType.QUALIFICATION,
    'Playoff': MatchType.PLAYOFF
  };

  const reverseAllianceMap: Record<string, Alliance> = {
    'Red': Alliance.RED,
    'Blue': Alliance.BLUE
  };

  const reverseHopperMap: Record<string, number> = {
    '0-20': 0,
    '21-40': 1,
    '41-60': 2,
    '61+': 3
  };

  // Helper for shooter array
  const parseShooter = (str: string): number[] => {
    if (!str || str === '4') return [];
    return str.split('-').map(n => parseInt(n, 10));
  };

  return {
    // Generate a temporary ID for imported records
    id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

    // 0: timestamp is ignored
    teamNumber: String(data[1] || ''),               // 1: team_num
    matchNumber: String(data[2] || ''),              // 2: match_num
    matchType: reverseMatchTypeMap[data[3]] || MatchType.QUALIFICATION, // 3: match_type
    alliance: reverseAllianceMap[data[4]] || Alliance.RED, // 4: alliance
    scouter: data[5] || '',                          // 5: scouter
    startingZone: reverseZoneMap[data[6]] || StartingZone.DEPOT, // 6: start_zone
    isActiveInAuto: data[7] === 1 || data[7] === true, // 7: auto_active
    autoHang: data[8] === 1 || data[8] === true,       // 8: auto_hang
    autoFuelPoints: Number(data[9] ?? 0),            // 9: auto_pts
    autoComments: String(data[10] ?? ''),            // 10: auto_comm
    teleopFuelPoints: Number(data[11] ?? 0),         // 11: tele_pts
    teleopComments: String(data[12] ?? ''),          // 12: tele_comm
    climbLevel: Number(data[13] ?? 0),               // 13: tele_hang
    adv_field_role: (data[14] !== undefined && data[14] !== null) ? Number(data[14]) : -1, // 14: adv_role
    adv_broke: (data[15] !== undefined && data[15] !== null) ? Number(data[15]) : -1,      // 15: adv_broke
    adv_fixed: (data[16] !== undefined && data[16] !== null) ? Number(data[16]) : -1,      // 16: adv_fixed
    adv_chasis: (data[17] !== undefined && data[17] !== null) ? Number(data[17]) : -1,     // 17: adv_chasis
    adv_intake: (data[18] !== undefined && data[18] !== null) ? Number(data[18]) : -1,     // 18: adv_intake
    adv_shooter: parseShooter(data[19]),             // 19: adv_shooter
    adv_climber: (data[20] !== undefined && data[20] !== null) ? Number(data[20]) : -1,    // 20: adv_climber
    adv_hopper_cap: (data[21] !== undefined && data[21] !== null) ? (reverseHopperMap[data[21]] ?? -1) : -1, // 21: adv_hoppercapacity
    adv_trench: (data[22] !== undefined && data[22] !== null) ? Number(data[22]) : -1,     // 22: adv_trench
    comments: String(data[23] ?? ''),                // 23: adv_comments

    // Defaults for fields not in CSV
    endgameScore: 0
  };
};