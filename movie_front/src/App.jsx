import Search from './components/Search';

const App = () => {
  return (
    <main className='min-h-screen relative'>
        <div className='w-full h-full absolute z-0'>
          <img src='/hero-bg.png' alt='Hero Banner' width={2880} height={1640} />
        </div>

        <div className='relative z-50 top-10 flex flex-col items-center justify-center text-white'>
        <img src='/hero.png' alt='Hero' width={480} height={280} />
        <h1 className=''>Find <span className='text-gradient'>Movies</span> You Will Love Without Hassel.</h1>
        <Search />
        </div>
    </main>
  )
}

export default App