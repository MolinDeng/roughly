import React from 'react';

export default function Author() {
  return (
    <div className="inline absolute bottom-0 left-0 m-2 text-slate-800 select-none">
      By{' '}
      <a
        className="underline text-blue-700"
        href="https://molin7.vercel.app/"
        target="_blank"
      >
        @molin
      </a>
      <br />
      View source on{' '}
      <a
        className="underline text-blue-700"
        href="https://github.com/MolinDeng/doodle"
        target="_blank"
      >
        Github
      </a>
    </div>
  );
}
