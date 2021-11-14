export const HomePage = () => {

    return (
        <div
            style={{ display: `flex`, flexDirection: `column`, justifyContent: `space-between`, alignItems: `center`, minHeight: `calc(100vh - 100px)` }}>
            <div style={{ width: `100%` }}>
            {/* <NftProjectsLoader/> */}
            </div>
            <CharacterArea/>

            {/* <OtherRarityTools/> */}
        </div>
    );
};


const CharacterArea = (props: {}) => {
    return (
        <>
            <div style={{ display: `flex`, flexDirection: `row` }}>
                <Character imageUrl={`/media/rick.png`} name={`@RickLove`} link={`https://twitter.com/Rick_00_Love`}/>
            </div>
        </>
    );
};

const Character = ({ imageUrl, name, link }: { imageUrl: string; name: string; link?: string }) => {
    return (
        <>
            <div className={link ? `link` : ``}
                style={{ padding: 8 }}
                onClick={(e) => {
                    if (!link){ return; }
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(link);
                }}>
                <div>
                    <img style={{ width: 150, height: 150, objectFit: `contain` }}
                        src={imageUrl} alt='image'/>
                </div>
                <div>
                    {!link && name}
                    {!!link && <a href={link}>{`${name}`}</a>}
                </div>
            </div>
        </>
    );
};
