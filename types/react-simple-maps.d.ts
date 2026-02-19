declare module "react-simple-maps" {
  import { ComponentType } from "react";
  export const ComposableMap: ComponentType<{
    projection?: string;
    projectionConfig?: Record<string, number | number[]>;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }>;
  export const Geographies: ComponentType<{
    geography: string | object;
    children: (props: { geographies: { rsmKey: string; [k: string]: unknown }[] }) => React.ReactNode;
  }>;
  export const Geography: ComponentType<{
    geography: { rsmKey?: string; [k: string]: unknown };
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: Record<string, React.CSSProperties>;
    children?: React.ReactNode;
  }>;
  export const Marker: ComponentType<{
    coordinates: [number, number];
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }>;
  export const Sphere: ComponentType<{ id?: string; fill?: string; stroke?: string }>;
}
