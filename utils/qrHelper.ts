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
      ? data.adv_shooter.sort((a, b) => a - b).join('-')
      : "4",                                         // 13: adv_shooter
    data.adv_climber,                                // 14: adv_climber
    data.adv_trench,                                 // 15: adv_trench
    hopperMap[data.adv_hopper_cap] ?? null,          // 16: adv_hoppercapacity
    data.adv_broke,                                  // 17: adv_broke
    data.adv_fixed                                   // 18: adv_fixed
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
    teamNumber: String(data[0] || ''),
    matchNumber: String(data[1] || ''),
    matchType: reverseMatchTypeMap[data[2]] || MatchType.QUALIFICATION,
    alliance: reverseAllianceMap[data[3]] || Alliance.RED,
    scouter: data[4] || '',
    startingZone: reverseZoneMap[data[5]] || StartingZone.DEPOT,
    isActiveInAuto: Boolean(data[6]),
    autoHang: Boolean(data[7]),
    autoFuelPoints: Number(data[8] || 0),
    teleopFuelPoints: Number(data[9] || 0),
    climbLevel: Number(data[10] || 0),
    adv_chasis: Number(data[11] || -1),
    adv_intake: Number(data[12] || -1),
    adv_shooter: parseShooter(data[13]),
    adv_climber: Number(data[14] || -1),
    adv_trench: Number(data[15] || -1),
    adv_hopper_cap: data[16] ? (reverseHopperMap[data[16]] ?? -1) : -1,
    adv_broke: Number(data[17] || -1),
    adv_fixed: Number(data[18] || -1),

    // Defaults for non-compressed fields
    id: '',
    autoComments: '',
    teleopComments: '',
    comments: '',
    endgameScore: 0 // Recalculate if needed, but not in QR
  };
};