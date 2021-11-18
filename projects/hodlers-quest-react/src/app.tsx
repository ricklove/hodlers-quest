import React from 'react';
import { Layout } from './components/layout';
import { HomePage } from './pages/home-page';
import { TokenArtPage } from './pages/token-art-page';
import { TokenIframePage } from './pages/token-iframe-page';
import { TokenPage } from './pages/token-page';

export const App = () => {
return (
      <Routing/>
  );
};

const Routing = (_props: {}) => {
  const route = window.location.pathname.split(`/`);
  const path = route[1] ?? undefined;
  const tokenId = route[route.length - 1] ?? undefined;

  console.log(`route`, { route });

  if (path === `image` && tokenId){
    return (
      <TokenIframePage tokenId={tokenId} renderMode={`image-only`}/>
    );
  }

  if (path === `iframe` && tokenId){
    return (
      <TokenIframePage tokenId={tokenId}/>
    );
  }

  if (path === `art` && tokenId){
    return (
      <Layout>
        <div className='App'>
            <TokenArtPage tokenId={tokenId}/>
        </div>
      </Layout>
    );
  }

  if (path === `nft` && tokenId){
    return (
      <Layout>
        <div className='App'>
            <TokenPage tokenId={tokenId}/>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='App'>
        <HomePage/>
      </div>
    </Layout>
  );
};
