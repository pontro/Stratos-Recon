export enum StartingZone {
  DEPOT = 'DEPOT',
  CENTER = 'CENTER',
  OUTPOST = 'OUTPOST'
}

export enum Alliance {
  RED = 'RED',
  BLUE = 'BLUE'
}

export enum MatchType {
  PRACTICE = 'PRACTICE',
  QUALIFICATION = 'QUAL',
  PLAYOFF = 'PLAYOFF'
}

export interface ScoutingData {
  id: string; // Unique identifier for local storage management
  teamNumber: string;
  matchNumber: string;
  matchType: MatchType;
  startingZone: StartingZone;
  alliance: Alliance;
  scouter: string; // Mandatory scouter initials
  
  // Autonomous Phase
  isActiveInAuto: boolean;
  autoHang: boolean;
  autoFuelPoints: number;
  autoComments: string;
  
  // Teleop Phase
  teleopFuelPoints: number;
  climbLevel: number; // 0, 1, 2, 3
  teleopComments: string;

  // Advanced Phase (Hardware & Strategy)
  adv_field_role: number;
  adv_hopper_cap: number;
  adv_chasis: number;
  adv_intake: number;
  adv_shooter: number[];
  adv_trench: number;
  adv_broke: number;
  adv_fixed: number;
  adv_climber: number;
  
  // Score / Outcome
  endgameScore: number;
  
  comments: string;
}

export enum AppPhase {
  SETUP = 'SETUP',
  AUTO = 'AUTO',
  TELEOP = 'TELEOP',
  ADVANCED = 'ADVANCED',
  REVIEW = 'REVIEW',
  FINISH = 'FINISH'
}

export enum Tab {
  SCOUT = 'SCOUT',
  VAULT = 'VAULT'
}