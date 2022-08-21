export const promisesSettled = (promises: Promise<any>[]) =>
  Promise.all(
    promises.map((p) =>
      p
        .then((value) => ({
          status: 'fulfilled' as const,
          value,
        }))
        .catch((reason) => ({
          status: 'rejected' as const,
          reason,
        }))
    )
  );
