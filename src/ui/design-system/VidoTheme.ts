export interface VidoTheme {
  name: string;
  radius: number;
  spacing: number;
  typography: {
    heading: string;
    body: string;
  };
}

export const vidoTheme: VidoTheme = {
  name: "VIDOAI",
  radius: 12,
  spacing: 8,
  typography: {
    heading: "system-ui",
    body: "system-ui",
  },
};

export default vidoTheme;
