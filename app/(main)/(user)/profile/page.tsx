import ChangePassword from './change-password';
import NotifyEvent from './notify-event';
import NotifySettings from './notify-settings';

export default function Page() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <NotifySettings />
      <NotifyEvent />
      <ChangePassword />
    </div>
  );
}
