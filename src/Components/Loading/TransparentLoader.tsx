const TransparentLoader = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-md">
      <div className="rounded-full h-20 w-20 dark:bg-contrastDark bg-contrastLight animate-ping"></div>
    </div>
  );
};

export default TransparentLoader;