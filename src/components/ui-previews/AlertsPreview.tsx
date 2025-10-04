"use client";
import Alert from "@/components/ui/alert/Alert";

export default function AlertsPreview() {
  return (
    <div className="space-y-4">
      <Alert
        variant="success"
        title="Success Message"
        message="This is a success alert."
      />
      <Alert
        variant="warning"
        title="Warning Message"
        message="This is a warning alert."
      />
      <Alert
        variant="error"
        title="Error Message"
        message="This is an error alert."
      />
      <Alert
        variant="info"
        title="Info Message"
        message="This is an info alert."
      />
    </div>
  );
}
