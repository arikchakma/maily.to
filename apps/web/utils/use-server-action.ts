import { useEffect, useRef, useState, useTransition } from 'react';

export const useServerAction = <P, R>(
  action: (_: P) => Promise<R>,
  onFinished?: (_: R | undefined) => void
): [(_: P) => Promise<R | undefined>, boolean] => {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<R>();
  const [finished, setFinished] = useState(false);
  const resolver = useRef<(value?: R | PromiseLike<R>) => void>();

  useEffect(() => {
    if (!finished) return;

    if (onFinished) onFinished(result);
    resolver.current?.(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on finished
  }, [result, finished]);

  const runAction = async (args: P): Promise<R | undefined> => {
    startTransition(() => {
      void action(args).then((data) => {
        setResult(data);
        setFinished(true);
      });
    });

    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  };

  return [runAction, isPending];
};
