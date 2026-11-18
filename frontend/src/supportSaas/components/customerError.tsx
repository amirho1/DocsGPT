import { Alert, AlertDescription } from '@/components/ui/alert';
/** Renders a safe, announced customer error using the upstream alert component. */
export default function CustomerError({ message }: { message: string }) {
  return message ? (
    <Alert variant="destructive">
      <AlertDescription>
        <p className="text-foreground">{message}</p>
      </AlertDescription>
    </Alert>
  ) : null;
}
