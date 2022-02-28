import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
// import * as s from "./styles/globalStyles";
import styled from "styled-components";
import * as s from "./styles/globalStyles";

const truncate = (input, len) =>
    input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [claimingNft, setClaimingNft] = useState(false);
    const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
    const [mintAmount, setMintAmount] = useState(1);
    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        SCAN_LINK: "",
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: 0,
        },
        NFT_NAME: "",
        SYMBOL: "",
        MAX_SUPPLY: 1,
        WEI_COST: 0,
        DISPLAY_COST: 0,
        GAS_LIMIT: 0,
        MARKETPLACE: "",
        MARKETPLACE_LINK: "",
        SHOW_BACKGROUND: false,
    });

    const claimNFTs = () => {
        let cost = CONFIG.WEI_COST;
        let gasLimit = CONFIG.GAS_LIMIT;
        let totalCostWei = String(cost * mintAmount);
        let totalGasLimit = String(gasLimit * mintAmount);
        console.log("Cost: ", totalCostWei);
        console.log("Gas limit: ", totalGasLimit);
        setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
        setClaimingNft(true);
        blockchain.smartContract.methods
            .mint(blockchain.account, mintAmount)
            .send({
                gasLimit: String(totalGasLimit),
                to: 'CONFIG.CONTRACT_ADDRESS',
                from: blockchain.account,
                value: totalCostWei,
            })
            .once("error", (err) => {
                console.log(err);
                setFeedback("Sorry, something went wrong please try again later.");
                setClaimingNft(false);
            })
            .then((receipt) => {
                console.log(receipt);
                setFeedback(
                    `WOW, the ${CONFIG.NFT_NAME} is yours! go visit OpenSea.io to view it.`
                );
                setClaimingNft(false);
                dispatch(fetchData(blockchain.account));
            });
    };

    const decrementMintAmount = () => {
        let newMintAmount = mintAmount - 1;
        if (newMintAmount < 1) {
            newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
    };

    const incrementMintAmount = () => {
        let newMintAmount = mintAmount + 1;
        if (newMintAmount > 50) {
            newMintAmount = 50;
        }
        setMintAmount(newMintAmount);
    };

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

    const getConfig = async () => {
        const configResponse = await fetch("/config/config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();
        SET_CONFIG(config);
    };

    useEffect(() => {
        getConfig();
    }, []);

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    return (
        <div>
            <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark navigation_container">
                <div className="container">
                    <a className="navbar-brand fw-bold text-uppercase" href="#">Somber Squad</a>



                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" aria-current="page" href="#project_section">Project</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#team_section">Team</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#timeline_section">Timeline</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#faq_section">FAQ</a>
                            </li>

                        </ul>
                    </div>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a href="https://discord.gg/KDyq6aHArM" target="_blank" className="nav-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                                     className="bi bi-discord" viewBox="0 0 18 18">
                                    <path
                                        d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0
                          0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0
                          0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0
                          0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0
                          3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051
                          0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1
                          .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041
                          0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0
                          1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0
                          .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0
                          .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198
                          7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0
                          .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613
                          1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                                </svg>
                            &nbsp;Discord</a>
                        </li>
                        <li className="nav-item">
                            <a href="https://twitter.com/SomberSquadNFT" target="_blank" className="nav-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                                     className="bi bi-twitter" viewBox="0 0 18 18">
                                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16
                      3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286
                      3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0
                      0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0
                      1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0
                      1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                                </svg>
                                &nbsp;Twitter</a>
                        </li>
                        <li className="nav-item">
                            <button href="#" className="btn btn-dark bg-light text-uppercase text-dark "
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(connect());
                                        getData();
                                    }}
                            >{(blockchain.account === "" ||
                                blockchain.smartContract === null) ? "Connect Wallet To Mint" : truncate(blockchain.account, 15)}
                            </button>
                        </li>
                    </ul>

                </div>
            </nav>

            <div className="container-fluid bg-dark d-flex justify-content-center align-items-center">
                {blockchain.errorMsg !== "" ? (
                    <>
                        <s.SpacerSmall />
                        <s.TextDescription
                            style={{
                                textAlign: "center",
                                color: "white",
                            }}
                        >
                            {blockchain.errorMsg}
                        </s.TextDescription>
                    </>
                ) : <>
                    <s.SpacerSmall />
                    <s.TextDescription>
                        <br />
                    </s.TextDescription>
                </>}
            </div>

            <div className="container-fluid bg-dark d-flex justify-content-center align-items-center first_page">
                <div className="row d-flex flex-wrap justify-content-center mt-5">
                    <div className="col-sm-7 col-lg-8 col-md-8">
                        <img className="img-fluid rounded" width="500" height="500" src={"/config/images/1_500.png"} alt="img" />
                    </div>
                    <div className="col-sm-5 col-lg-4 col-md-4  d-flex flex-column justify-content-center mt-5">
                        <h1 className="text-uppercase text-light fs-1 text-center monserrat_extra_bold">
                            Somber Squad</h1>
                        <button href="#" className="btn btn-dark bg-light text-uppercase text-dark ">Buy
                            on OpenSea
                        </button>
                        <br />
                        {(blockchain.account === "" || blockchain.smartContract === null)
                            ?
                            (<><br /><br /><br />
                            </>)
                            :
                            (<><p className="text-light text-center">or</p>
                                <button disabled={claimingNft ? 1 : 0}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            claimNFTs();
                                            getData();
                                        }}
                                        href="#" className="btn btn-dark bg-light text-uppercase text-dark ">
                                    {claimingNft ? "Busy" : "Mint here at 0.2 eth"}
                                </button>
                            </>)
                        }
                    </div>
                </div>
            </div>
            <div id="project_section" className="container-fluid bg-dark d-flex flex-column justify-content-center align-items-center team
              second_page">
                <h1 className="text-uppercase text-light text-center mt-5">The Project</h1>
                <div className="row d-flex flex-wrap justify-content-center mt-5">
                    <div className="col-sm-4 col-lg-3 col-md-3 text-center">
                        <img className="img-fluid rounded" width="300" height="300" src={"/config/images/2_300.png"} alt="img" />
                    </div>
                    <div className="col-sm-3 col-lg-3 col-md-3 d-flex flex-column text-light justify-content-center med-font mt-5">
                        <p>Somber Squad launched on March 15, 2022. Each NFT is unique and no two are exactly alike.
                            The combination of the aesthetics was randomly generated from multiple hand drawn traits.</p>
                    </div>
                </div>
                <div className="row d-flex flex-wrap justify-content-center mt-5">
                    <div className="col-sm-3 col-lg-3 col-md-3 d-flex flex-column text-light justify-content-center med-font ">
                        <p>Some traits are common and some are rare. If you’re lucky, you might get a legendary trait!.</p>
                    </div>
                    <div className="col-sm-4 col-lg-3 col-md-3 text-center mt-5">
                        <img className="img-fluid rounded" width="300" height="300" src={"/config/images/3_400.png"} alt="img" />
                    </div>
                </div>
                <div className="row d-flex flex-wrap justify-content-center mt-5">
                    <div className="col-sm-4 col-lg-3 col-md-3 text-center">
                        <img className="img-fluid rounded" width="300" height="300" src={"/config/images/4_400.png"} alt="img" />
                    </div>
                    <div className="col-sm-3 col-lg-3 col-md-3 d-flex flex-column text-light justify-content-center med-font mt-5">
                        <p>As a thank you for supporting Yuna (the artist), NFT holders will have access to her latest projects.
                            Be sure to follow Somber Squad in Twitter and join the Discord channel</p>
                    </div>
                </div>
                <div className="row d-flex flex-wrap justify-content-center mt-5">
                    <div className="col-sm-3 col-lg-3 col-md-3 d-flex flex-column text-light justify-content-center med-font ">
                        <p>Your minted or bought NFTs are viewable on your account as well as on the official OpenSea Somber Squad collection.</p>
                    </div>
                    <div className="col-sm-4 col-lg-3 col-md-3 text-center mt-5">
                        <img className="img-fluid rounded" width="300" height="300" src={"/config/images/5_400.png"} alt="img" />
                    </div>
                </div>
            </div>
            <div id="team_section" className="container-fluid bg-dark d-flex flex-column justify-content-center align-items-center team
              second_page">
                <h1 className="text-uppercase text-light text-center mt-5">The Team</h1>
                <div className="d-flex gap-3 flex-wrap justify-content-center mt-5">
                    <div className="d-flex flex-column justify-content-center align-items-center gap-4 second_page_inner1">
                        <img src="/config/images/6_400.png" className="card-img-top avatar_card" id="ser" alt="..." />
                        <div className="d-flex align-items-center justify-content-center">
                            <p className="card-text fw-bold text-primary">
                                luna
                            </p>
                        </div>
                        <div className="card-text ps-2 border-start text-light">
                            Co-founder of Somber Squad. The talent. Art Designer.
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-center gap-4 second_page_inner1">
                        <img src="/config/images/7_400.png" className="card-img-top avatar_card" alt="..." />
                        <div className="d-flex align-items-center justify-content-center">
                            <p className="card-text fw-bold text-primary">
                                cidd
                            </p>
                        </div>
                        <div className="card-text ps-2 border-start text-light">
                            Co-founder of Somber Squad. Tech Guy. Loves to play chess.
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-center gap-4 second_page_inner1">
                        <img src="/config/images/8_400.png" className="card-img-top avatar_card" alt="..." />
                        <div className="d-flex align-items-center justify-content-center">
                            <p className="card-text fw-bold text-primary">
                                nikola
                            </p>
                        </div>
                        <div className="card-text ps-2 border-start text-light">
                            Co-founder of Suicide Squad. Operations and Social Media Manager.
                        </div>
                    </div>
                </div>
            </div>
            <div id="timeline_section" className="container-fluid bg-dark d-flex flex-column justify-content-center align-items-center" >
                <h1 className="text-uppercase text-light text-center mt-5">Timeline</h1>
                <div className="d-flex gap-3 flex-wrap justify-content-center mt-5">
                    <div className="d-flex flex-column justify-content-center align-items-center gap-4 second_page_inner1">
                        <div className="card-text ps-2 text-light text-right">
                            <p className="text-right">March 5 2022</p>
                            <p>LAUNCHING INTO THE METAVERSE</p>
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-center gap-4 second_page_inner1 ">
                        <div className="card-text ps-2 border-start text-light monserrat">
                            <p>Founder Somber Squad NFTs available to mint on March 5, 2022 for 35 MATIC (~0.02 ETH or ~50 USD) and sold out in less than 10 minutes</p>
                        </div>
                    </div>
                </div>
                <div className="d-flex gap-3 flex-wrap justify-content-center">
                    <div className="d-flex flex-column justify-content-center align-items-center gap-4 second_page_inner1">
                        <div className="card-text ps-2 text-light text-right">
                            <br />
                            <br />
                            <br />
                            <p className="text-right">March 20 2022</p>
                            <p>PUBLIC SALE OF NFTs</p>
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-center gap-4 second_page_inner1 ">
                        <div className="card-text ps-2 border-start text-light monserrat">
                            <br />
                            <br />
                            <br />
                            <p>Public sale of Somber Squad NFTs. First team party held!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="faq_section" className="container-fluid bg-dark d-flex flex-column justify-content-center align-items-center team">
                <h1 className="text-uppercase text-light text-center mt-5">Frequently Asked Questions</h1>
                <h4 className="text-uppercase text-light text-center padding-top-md">1. Where do I see my newly minted Somber Squad NFT?</h4>
                <div className="col-sm-7 col-lg-7 col-md-7 d-flex flex-column text-light text-justify justify-content-center med-font mt-5">
                    <p className="text-light">Somber Squad NFT adheres to ERC721 standard and follows OpenSea metadata. You can find your NFTs <a href="https://opensea.io/account" target="_blank">our your OpenSea account</a>.
                    </p>
                </div>
                <h4 className="text-uppercase text-light text-center padding-top-md">2. How do I mint a Somber Squad NFT?</h4>
                <div className="col-sm-7 col-lg-7 col-md-7 d-flex flex-column text-light text-justify justify-content-center med-font mt-5">
                    <p className="text-light">First, you should have metamask installed. Since Somber Squad NFT is using the Polygon Network, you should fund your wallet with MATIC.
                        You can buy MATIC from popular crypto exchange platforms such as Binance and Crypto.com and then send them to your metamask wallet. Make sure you are transferring using the Polygon Network.
                        Once your wallet is funded, click the 'Mint Here' button on this site.
                    </p>
                </div>
                <h4 className="text-uppercase text-light text-center padding-top-md">3. Can I buy this NFT in OpenSea without high gas fees?</h4>
                <div className="col-sm-7 col-lg-7 col-md-7 d-flex flex-column text-light text-justify justify-content-center med-font mt-5">
                    <p className="text-light">Sombre Squad NFT is stored in the Polygon Network which OpenSea supports and recommends. You need WETH (wrapped ETH) to
                        purchase Somber Squad NFT in OpenSea and one cheap way to fund your metamask wallet is to buy MATIC and use <a href="https://app.sushi.com/swap" target="_blank">sushiswap</a> to convert from MATIC to WETH.
                    </p>
                </div>
                <h4 className="text-uppercase text-light text-center padding-top-md">4. What is the Somber Squad Twitter?</h4>
                <div className="col-sm-7 col-lg-7 col-md-7 d-flex flex-column text-light text-justify justify-content-center med-font mt-5">
                    <p className="text-light">You can follow <a href="https://twitter.com/SomberSquadNFT" target="_blank">our Twitter</a>. We post updates, news, and a variety of content on our Twitter.
                    </p>
                </div>
                <h4 className="text-uppercase text-light text-center padding-top-md">5. What is the Somber Squad Twitter?</h4>
                <div className="col-sm-7 col-lg-7 col-md-7 d-flex flex-column text-light text-justify justify-content-center med-font mt-5">
                    <p className="text-light">You can follow <a href="https://discord.gg/KDyq6aHArM" target="_blank">our Discord</a>. Our moderators are willing to address any of your concerns.
                    </p>
                </div>


                <div className="footer bg-dark d-flex flex-column align-items-center justify-content-center footer-inner monserrat_extra_bold">
                    <div><a className="nav-link" href={CONFIG.SCAN_LINK}  target="_blank">Smart Contract</a>
                    </div>
                    <div className="text-center text-uppercase text-light">©2022 Somber Squad. All rights reserved.</div>
                </div>
            </div>
        </div>
    );
}

export default App;
