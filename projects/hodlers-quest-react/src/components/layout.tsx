import React, { } from 'react';

export const Layout = ({ children }: { children: JSX.Element }) => {

    return (
        <>
            <div className='header' style={{ display: `flex`, flexDirection: `row`, padding: 8, alignItems: `flex-start` }}>
                <div style={{ fontSize: 36, marginRight: 16 }}>
                    <a href='/'>
                        {`HODLer's Quest`}
                    </a>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ fontSize: 24, marginLeft: 16 }}>
                    <a href='https://discord.gg/vyuBsGAneW' target='_blank' rel='noreferrer'>
                        {`Discord`}
                    </a>
                </div>
            </div>
            <div>
                {children}
            </div>
        </>
    );
};
