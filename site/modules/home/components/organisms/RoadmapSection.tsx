function RoadmapSection() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section__title mb-5 lg:mb-[50px]">Our roadmap</h2>
        <div className="steps grid md:grid-cols-4 gap-[28px]">
          <div className="step">
            <h3>Q1 2022</h3>
            <ul>
              <li>Research Market</li>
              <li>Build Social and Marketing Community</li>
              <li>Publish website</li>
              <li>Introduce of the ZIKJOB Community Program (Airdrop,...)</li>
            </ul>
          </div>
          <div className="step">
            <h3>Q2 2022</h3>
            <ul>
              <li>Build NFTs Marketplace</li>
              <li>Build ZIK Profile</li>
              <li>Listing on CMC</li>
            </ul>
          </div>
          <div className="step">
            <h3>Q3 2022</h3>
            <ul>
              <li>ZIK Profile Testnet</li>
              <li>Launch NFT Marketplace</li>
              <li>Community NFTs Airdrop</li>
              <li>Launch ZJS Staking Program</li>
            </ul>
          </div>
          <div className="step">
            <h3>Q4 2022</h3>
            <ul>
              <li>ZIK Profile Update</li>
              <li>Build Multichain: Lukso, Polygon...</li>
              <li>Launch Beta Job Listing System</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoadmapSection;
