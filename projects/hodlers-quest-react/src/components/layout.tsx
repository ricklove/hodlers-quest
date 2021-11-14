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
            </div>
            <div>
                {children}
            </div>
        </>
    );
};
