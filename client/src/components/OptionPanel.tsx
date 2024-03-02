import React from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Ban } from 'lucide-react';

type Opt = {
  value: string;
  ariaLabel: string;
  html: React.ReactNode;
  className?: string;
};

interface OptionProps {
  title: string;
  opts: Opt[];
}

function Option({ title, opts }: OptionProps) {
  return (
    <div>
      <p className="text-xs px-[1px] py-1">{title}</p>
      <ToggleGroup type="single" size={'ssm'} variant={'violet'}>
        {opts.map((opt) => (
          <ToggleGroupItem
            key={opt.value}
            className={opt.className}
            value={opt.value}
            aria-label={opt.ariaLabel}
          >
            {opt.html}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

const options: OptionProps[] = [
  {
    title: 'Stroke',
    opts: [
      {
        value: 'select',
        ariaLabel: 'Select object',
        html: <div className="h-3 w-3 bg-black" />,
      },
      {
        value: 'line',
        ariaLabel: 'Toggle line',
        html: <div className="h-3 w-3 bg-red-600" />,
      },
      {
        value: 'arrow',
        ariaLabel: 'Toggle arrow',
        html: <div className="h-3 w-3 bg-blue-600" />,
      },
    ],
  },
  {
    title: 'Background',
    opts: [
      {
        value: 'select',
        ariaLabel: 'Select object',
        html: <Ban className="h-3 w-3" />,
      },
      {
        value: 'line',
        ariaLabel: 'Toggle line',
        html: <div className="h-3 w-3 bg-red-600" />,
      },
      {
        value: 'arrow',
        ariaLabel: 'Toggle arrow',
        html: <div className="h-3 w-3 bg-blue-600" />,
      },
    ],
  },
  {
    title: 'Roughness',
    opts: [
      {
        value: 'select',
        ariaLabel: 'Select object',
        html: (
          <svg className="h-4 w-4 " viewBox="0 0 20 20" fill="none">
            <path
              d="M2.5 12.038c1.655-.885 5.9-3.292 8.568-4.354 2.668-1.063.101 2.821 1.32 3.104 1.218.283 5.112-1.814 5.112-1.814"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        value: 'line',
        ariaLabel: 'Toggle line',
        html: (
          <svg className="h-4 w-4 " viewBox="0 0 20 20" fill="none">
            <path
              d="M2.5 12.563c1.655-.886 5.9-3.293 8.568-4.355 2.668-1.062.101 2.822 1.32 3.105 1.218.283 5.112-1.814 5.112-1.814m-13.469 2.23c2.963-1.586 6.13-5.62 7.468-4.998 1.338.623-1.153 4.11-.132 5.595 1.02 1.487 6.133-1.43 6.133-1.43"
              stroke="black"
              focusable="false"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        value: 'arrow',
        ariaLabel: 'Toggle arrow',
        html: (
          <svg className="h-4 w-4 " viewBox="0 0 20 20" fill="none">
            <path
              d="M2.5 11.936c1.737-.879 8.627-5.346 10.42-5.268 1.795.078-.418 5.138.345 5.736.763.598 3.53-1.789 4.235-2.147M2.929 9.788c1.164-.519 5.47-3.28 6.987-3.114 1.519.165 1 3.827 2.121 4.109 1.122.281 3.839-2.016 4.606-2.42"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              focusable="false"
            />
          </svg>
        ),
      },
    ],
  },
];

export default function OptionPanel() {
  return (
    <aside className="fixed top-[10%] bottom-1/2 left-4 w-40 bg-white shadow-lg rounded-lg overflow-auto">
      {/* Sidebar content goes here */}
      <div className="flex flex-col items-start p-4 space-y-2">
        {options.map((option) => (
          <Option key={option.title} title={option.title} opts={option.opts} />
        ))}
      </div>
    </aside>
  );
}
