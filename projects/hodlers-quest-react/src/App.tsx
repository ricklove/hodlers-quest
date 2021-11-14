import React from 'react';
import { Layout } from './components/layout';
import { HomePage } from './pages/home-page';

export const App = () => {
return (
  <Layout>
      <Routing/>
  </Layout>
  );
};

  const Routing = (_props: {}) => {
    const route = window.location.pathname.split(`/`);
    // const projectKey = route[1] ?? undefined;
    // const tokenId = route[2] ?? undefined;

    console.log(`route`, { route });

    // if (projectKey && tokenId){
    //   return (
    //     <div className='App'>
    //       <div className='nft-container-single'>
    //         <NftLoader projectKey={projectKey} tokenId={tokenId}/>
    //       </div>
    //     </div>
    //   );
    // }

    // if (projectKey){
    //   return (
    //     <div className='App'>
    //       <NftProjectLoader projectKey={projectKey}/>
    //     </div>
    //   );
    // }

    return (
      <div className='App'>
          <HomePage/>
      </div>
    );
  };
