import React from 'react';
import { Layout } from './components/layout';
import { HomePage } from './pages/home-page';
import { TokenPage } from './pages/token-page';

export const App = () => {
return (
  <Layout>
      <Routing/>
  </Layout>
  );
};

  const Routing = (_props: {}) => {
    const route = window.location.pathname.split(`/`);
    const tokenId = route[1] ?? undefined;
    // const projectKey = route[1] ?? undefined;
    // const tokenId = route[2] ?? undefined;

    console.log(`route`, { route });

    if (tokenId){
      return (
        <div className='App'>
            <TokenPage tokenId={tokenId}/>
        </div>
      );
    }

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
