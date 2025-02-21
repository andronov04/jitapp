import { AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function FailedAlert({
  data,
}: { data: { message?: string; code: string | number } }) {
  // TODO: validate error, if not enough credits
  return (
    <AnimatePresence>
      <motion.div
        className=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Alert
          variant="destructive"
          className="dark:bg-[#160b0b] bg-[#fdeded] border-none text-muted-foreground"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{data.message || 'Unknown error'}</AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}
