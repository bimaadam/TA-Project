"use client";
import Badge from "@/components/ui/badge/Badge";

export default function BadgesPreview() {
  return (
    <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
            <Badge variant="light" color="primary">Primary</Badge>
            <Badge variant="light" color="success">Success</Badge>
            <Badge variant="light" color="error">Error</Badge>
            <Badge variant="light" color="warning">Warning</Badge>
            <Badge variant="light" color="info">Info</Badge>
        </div>
        <div className="flex flex-wrap gap-4">
            <Badge variant="solid" color="primary">Primary</Badge>
            <Badge variant="solid" color="success">Success</Badge>
            <Badge variant="solid" color="error">Error</Badge>
            <Badge variant="solid" color="warning">Warning</Badge>
            <Badge variant="solid" color="info">Info</Badge>
        </div>
    </div>
  );
}
