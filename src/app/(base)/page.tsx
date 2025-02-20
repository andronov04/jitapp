import FormView from '@/components/box/form';

export default async function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-2xl mx-auto w-full">
        <FormView />
      </div>
    </div>
  );
}
