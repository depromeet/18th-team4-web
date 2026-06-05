import { cn } from '@/lib';

type StepProgressProps = {
  stepIds: string[];
  activeId: string;
};

export const StepProgress = (props: StepProgressProps) => {
  const { stepIds, activeId } = props;

  return (
    <div className="flex items-center gap-[0.5rem]">
      {stepIds.map((id) => (
        <span
          key={id}
          aria-hidden
          className={cn(
            'block h-[0.6rem] rounded-full transition-all',
            id === activeId ? 'w-[2.6rem] bg-icon-primary' : 'w-[0.6rem] bg-icon-disabled',
          )}
        />
      ))}
    </div>
  );
};
