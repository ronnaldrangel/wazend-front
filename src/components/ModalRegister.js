'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';

export default function ModalExample() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onClose={() => {}} className="relative z-10">
      {/* Backdrop */}
      <Dialog.Overlay className="fixed inset-0 bg-gray-500/75 transition-opacity" />

      {/* Modal Panel */}
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl sm:my-8 sm:w-full sm:max-w-4xl">
          {/* Empty content */}
          <div className="p-6">
            {/* You can add any content here in the future */}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
