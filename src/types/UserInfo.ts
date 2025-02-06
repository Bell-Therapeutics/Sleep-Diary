export type UserInfoType = {
  result_code: number;
  token: string;
  name: string;
  user_id: string;
  access_start: string;
  access_end: string;
  last_session_day: string;
  access_count: number;
  touch_mode: number;
  push_yn: "Y" | "N";
  st_score: number;
  sleep_score: number;
  breathe_score: number;
  latest_avg_inhale: number;
  latest_avg_exhale: number;
  is_tutorial_completed: boolean;
};
