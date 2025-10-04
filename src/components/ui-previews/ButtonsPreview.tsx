"use client";
import Button from "@/components/ui/button/Button";
import { BoxIcon } from "@/icons";

export default function ButtonsPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-5">
        <Button size="sm" variant="primary">Primary SM</Button>
        <Button size="md" variant="primary">Primary MD</Button>
      </div>
      <div className="flex items-center gap-5">
        <Button size="sm" variant="outline">Outline SM</Button>
        <Button size="md" variant="outline">Outline MD</Button>
      </div>
      <div className="flex items-center gap-5">
        <Button size="sm" variant="danger">Danger SM</Button>
        <Button size="md" variant="danger">Danger MD</Button>
      </div>
      <div className="flex items-center gap-5">
        <Button size="md" variant="primary" startIcon={<BoxIcon />}>Left Icon</Button>
        <Button size="md" variant="outline" endIcon={<BoxIcon />}>Right Icon</Button>
      </div>
    </div>
  );
}
