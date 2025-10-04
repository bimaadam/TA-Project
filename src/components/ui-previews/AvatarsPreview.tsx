"use client";
import Avatar from "@/components/ui/avatar/Avatar";

export default function AvatarsPreview() {
  return (
    <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-start gap-5">
            <Avatar src="/images/user/user-01.jpg" size="xsmall" />
            <Avatar src="/images/user/user-02.jpg" size="small" />
            <Avatar src="/images/user/user-03.jpg" size="medium" />
            <Avatar src="/images/user/user-04.jpg" size="large" />
            <Avatar src="/images/user/user-05.jpg" size="xlarge" />
        </div>
        <div className="flex flex-wrap items-center justify-start gap-5">
            <Avatar src="/images/user/user-01.jpg" size="medium" status="online" />
            <Avatar src="/images/user/user-02.jpg" size="medium" status="offline" />
            <Avatar src="/images/user/user-03.jpg" size="medium" status="busy" />
        </div>
    </div>
  );
}
