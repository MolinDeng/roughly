'use client';
import React from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Ban } from 'lucide-react';
import { useWindowSize } from '@/hooks/UseWindowSize';
import { cn } from '@/lib/utils';

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
        value: 'black',
        ariaLabel: 'Select black stroke',
        html: <div className="h-3.5 w-3.5 bg-black rounded-[4px]" />,
      },
      {
        value: 'red',
        ariaLabel: 'Select red stroke',
        html: <div className="h-3.5 w-3.5 bg-red-600 rounded-[4px]" />,
      },
      {
        value: 'blue',
        ariaLabel: 'Select blue stroke',
        html: <div className="h-3.5 w-3.5 bg-blue-600 rounded-[4px]" />,
      },
    ],
  },
  {
    title: 'Background',
    opts: [
      {
        value: 'none',
        ariaLabel: 'Select object',
        html: <Ban className="h-3.5 w-3.5" />,
      },
      {
        value: 'line',
        ariaLabel: 'Toggle line',
        html: <div className="h-3.5 w-3.5 bg-red-600 rounded-[4px]" />,
      },
      {
        value: 'arrow',
        ariaLabel: 'Toggle arrow',
        html: <div className="h-3.5 w-3.5 bg-blue-600 rounded-[4px]" />,
      },
    ],
  },
  {
    title: 'Fill',
    opts: [
      {
        value: 'black',
        ariaLabel: 'Select black stroke',
        html: (
          <svg
            className="h-4 w-4"
            aria-hidden="true"
            focusable="false"
            role="img"
            viewBox="0 0 20 20"
            fill="none"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.25"
          >
            <path
              d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z"
              stroke="currentColor"
            />
            <mask
              id="FillHachureIcon"
              maskUnits="userSpaceOnUse"
              x="2"
              y="2"
              width="16"
              height="16"
              style={{ maskType: 'alpha' }}
            >
              <path
                d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z"
                fill="black"
                stroke="black"
                strokeWidth="1.25"
              ></path>
            </mask>
            <g mask="url(#FillHachureIcon)">
              <path
                d="M2.258 15.156 15.156 2.258M7.324 20.222 20.222 7.325m-20.444 5.35L12.675-.222m-8.157 18.34L17.416 5.22"
                stroke="black"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        ),
      },
      {
        value: 'red',
        ariaLabel: 'Select red stroke',
        html: (
          <svg
            className="h-4 w-4"
            aria-hidden="true"
            focusable="false"
            role="img"
            viewBox="0 0 20 20"
            fill="none"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <g clipPath="url(#a)">
              <path
                d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z"
                stroke="black"
                strokeWidth="1.25"
              ></path>
              <mask
                id="FillCrossHatchIcon"
                maskUnits="userSpaceOnUse"
                x="-1"
                y="-1"
                width="22"
                height="22"
                style={{ maskType: 'alpha' }}
              >
                <path
                  d="M2.426 15.044 15.044 2.426M7.383 20 20 7.383M0 12.617 12.617 0m-7.98 17.941L17.256 5.324m-2.211 12.25L2.426 4.956M20 12.617 7.383 0m5.234 20L0 7.383m17.941 7.98L5.324 2.745"
                  stroke="black"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </mask>
              <g mask="url(#FillCrossHatchIcon)">
                <path
                  d="M14.121 2H5.88A3.879 3.879 0 0 0 2 5.879v8.242A3.879 3.879 0 0 0 5.879 18h8.242A3.879 3.879 0 0 0 18 14.121V5.88A3.879 3.879 0 0 0 14.121 2Z"
                  fill="black"
                ></path>
              </g>
            </g>
            <defs>
              <clipPath id="a">
                <path fill="#fff" d="M0 0h20v20H0z"></path>
              </clipPath>
            </defs>
          </svg>
        ),
      },
      {
        value: 'blue',
        ariaLabel: 'Select blue stroke',
        html: <div className="h-3.5 w-3.5 bg-black rounded-[4px]" />,
      },
    ],
  },
  {
    title: 'Stoke Width',
    opts: [
      {
        value: 'select',
        ariaLabel: 'Select object',
        html: (
          <svg className="h-4 w-4 " viewBox="0 0 20 20" fill="none">
            <path
              d="M4.167 10h11.666"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.25}
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
              d="M5 10h10"
              stroke="black"
              focusable="false"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
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
              d="M5 10h10"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              focusable="false"
              strokeWidth={3.75}
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Stoke Style',
    opts: [
      {
        value: 'select',
        ariaLabel: 'Select object',
        html: (
          <svg className="h-4 w-4 " viewBox="0 0 20 20" fill="none">
            <path
              d="M4.167 10h11.666"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.25}
            />
          </svg>
        ),
      },
      {
        value: 'line',
        ariaLabel: 'Toggle line',
        html: (
          <svg
            className="h-4 w-4 "
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <g strokeWidth="2">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M5 12h2"></path>
              <path d="M17 12h2"></path>
              <path d="M11 12h2"></path>
            </g>
          </svg>
        ),
      },
      {
        value: 'arrow',
        ariaLabel: 'Toggle arrow',
        html: (
          <svg
            className="h-4 w-4 "
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <g strokeWidth="2">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M4 12v.01"></path>
              <path d="M8 12v.01"></path>
              <path d="M12 12v.01"></path>
              <path d="M16 12v.01"></path>
              <path d="M20 12v.01"></path>
            </g>
          </svg>
        ),
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
  const { height } = useWindowSize();
  return (
    <aside
      className={cn(
        // max-h-[325px]
        'fixed top-[10%] left-4 w-40 bg-white shadow-lg rounded-lg overflow-auto select-none',
        height < 600 && 'h-[54%]'
      )}
    >
      {/* Sidebar content goes here */}
      <div className="flex flex-col items-start p-4 space-y-2">
        {options.map((option) => (
          <Option key={option.title} title={option.title} opts={option.opts} />
        ))}
      </div>
    </aside>
  );
}
