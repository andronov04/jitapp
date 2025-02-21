import { IModelStore } from '@/lib/store/model';
import { cn } from '@/lib/utils';

const ModelItem = ({ model }: { model: IModelStore }) => {
  return (
    <div className="flex text-xs flex-col items-start justify-start">
      <div className="flex flex-row items-center gap-1">
        <img
          alt={model.providerKey}
          width="16"
          height="16"
          src={`/icons/${model.providerKey}.svg`}
          className={cn('selector-model-image dark:invert h-3 w-3')}
        />
        <p className=" opacity-50">{model.providerLabel}</p>
      </div>
      <div className="text-left text-nowrap ">
        <p>{model.modelLabel}</p>
      </div>
    </div>
  );
};
export default ModelItem;
