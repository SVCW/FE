import React from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom";

export default function Carousel () {
  return (
    <section>
      <div className="white-bg">
        <div className="container-fluid">
          <div className="menu-caro">
            <div className="row">
              <div className="col-lg-3">
                <div className="sidemenu">
                  
                </div>
              </div>
              <div className="col-lg-7 pl-3">
                <div className="page-caro">
                  <div className="link-item">
                    <a className="active" href="http://localhost:3000/home" title>
                      <i className>
                        <svg
                          className="feather feather-home"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth={2}
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 24 24"
                          height={24}
                          width={24}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </i>
                      <p>Trang chủ</p>
                    </a>
                  </div>
                  <div className="link-item">
                    <a href="http://localhost:3000/history" title>
                      <i className>
                        <svg
                          className="feather feather-zap"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth={2}
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 24 24"
                          height={24}
                          width={24}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      </i>
                      <p>Lịch sử quyên góp</p>
                    </a>
                  </div>
                  {/* <div className="link-item">
                                        <a href="courses.html" title>
                                            <i className>
                                                <svg className="feather feather-airplay" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                                                    <polygon points="12 15 17 21 7 21 12 15" />
                                                </svg></i>
                                            <p>Courses</p>
                                        </a>
                                    </div> */}
                  {/* <div className="link-item">
                    <a href="books.html" title>
                      <i className>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-book"
                        >
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                      </i>
                      <p>Books</p>
                    </a>
                  </div> */}
                  <div className="link-item">
                    <NavLink to="/statisticaluser">
                      <i class="fa-solid fa-chart-simple" style={{ color: "#088dcd" }}>
                        <svg className="feather feather-users"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth={2}
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 24 24"
                          height={24}
                          width={24}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                        </svg>
                      </i>

                      <p>Thống kê hoạt động</p>
                    </NavLink>
                  </div>
                  <div className="link-item">
                    <NavLink to="/groups" title>
                      <i className>
                        <svg
                          className="feather feather-users"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth={2}
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 24 24"
                          height={24}
                          width={24}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle r={4} cy={7} cx={9} />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </i>
                      <p>Nhóm</p>
                    </NavLink>
                  </div>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="sidemenu">
                  
                </div>
              </div>
              {/* <div className="col-lg-2">
                <div className="user-inf">
                  <div className="folowerz">Người Theo Dõi: 204</div>
                  <ul className="stars">
                    <li>
                      <i className="icofont-star" />
                    </li>
                    <li>
                      <i className="icofont-star" />
                    </li>
                    <li>
                      <i className="icofont-star" />
                    </li>
                    <li>
                      <i className="icofont-star" />
                    </li>
                    <li>
                      <i className="icofont-star" />
                    </li>
                  </ul>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
