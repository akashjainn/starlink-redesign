import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="app-phone-wrap">
      <div className="phone-frame">
        {children}
      </div>
    </div>
  );
}
