import React from "react";
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Spinner,
  Media,
} from "reactstrap";
import { ContextLayout } from "../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import {
  Trash2,
  ChevronDown,
  Clipboard,
  Printer,
  Download,
} from "react-feather";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../assets/scss/pages/users.scss";
import "react-toggle/style.css";
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss";
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions";
import StatisticsCard from "../../../components/@vuexy/statisticsCard/StatisticsCard";
import { createSocketClient, round } from "../utils/functions";
import { connect } from "react-redux";
import { mul } from "../utils/Math";
class UsersList extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (props.currentUserId !== state.currentUserId) {
      return {
        currentUserId: props.currentUserId,
      };
    }
    // Return null if the state hasn't changed
    return null;
  }
  state = {
    cmcDATA: null,
    cPaired: null,
    total_fees: null,
    total_price: null,
    total_volume: null,
    total_count: null,
    count: null,
    rowData: null,
    pageSize: 20,
    isVisible: true,
    reload: true,
    collapse: true,
    status: "Opened",
    role: "All",
    selectStatus: "All",
    verified: "All",
    department: "All",
    defaultColDef: {
      sortable: true,
    },
    searchVal: "",
    validPassword: true,
    columnDefs: [
      {
        headerName: "#",
        field: "rowIndex",
        filter: true,
        width: 50,
        cellRendererFramework: (params) => {
          return <>{1 + params.rowIndex}</>;
        },
      },
      {
        headerName: "Coin (Currency)",
        field: "currency_type",
        width: 200,
        filter: true,
        cellRendererFramework: (params) => {
          return (
            <div className="">
              {" "}
              {params?.value?.toUpperCase()} (
              {params?.data?.compare_currency?.toUpperCase()})
            </div>
          );
        },
      },
      {
        headerName: "Price",
        field: "price",
        filter: true,
        width: 150,
      },
      {
        headerName: "Volume",
        field: "volume",
        filter: true,
        width: 150,
      },
      {
        headerName: "Total",
        field: "total",
        filter: false,
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="">
              {params?.data?.price
                ? mul(Number(params?.data?.price), Number(params?.data?.volume))
                : 0}
            </div>
          );
        },
      },
      // {
      //   headerName: "Trade Fees",
      //   field: "commition_fee",
      //   filter: false,
      //   width: 130,
      // },
      {
        headerName: "Sell User",
        field: "sell_email",
        width: 250,
        editable: true,
        filter: true,
        cellRendererFramework: (params) => {
          return (
            <div className="badge badge-pill badge-light-danger">
              {" "}
              {params?.value}
            </div>
          );
        },
      },
      {
        headerName: "Buy User",
        field: "buy_email",
        width: 280,
        editable: true,
        filter: true,
        cellRendererFramework: (params) => {
          return (
            <div className="badge badge-pill badge-light-success">
              {" "}
              {params?.value}
            </div>
          );
        },
      },
      {
        headerName: "Date",
        field: "update",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return (
            <div className="">
              {" "}
              {params?.data?.updatedAt
                ? new Date(params?.data?.updatedAt).toLocaleString()
                : new Date(params?.data?.trade_date).toLocaleString()}
            </div>
          );
        },
      },
    ],
  };

  async componentDidMount() {
    const socket = new createSocketClient("kujgwvfq-a-ghosttown-z-1fhhup0p6");
    socket.on("cmc_updated", (res) => {
      if (res) {
        this.setState({ cmcDATA: res });
      }
    });
    const params = "&per_page=" + this.state.pageSize + "&page=1";
    getAPICall(
      "get-all-orderHistory?status=0&admin_user_id=" +
        this.state.currentUserId +
        params
    ).then((response) => {
      let rowData = response.data.result;
      let total_fees = response.data.total_fees;
      let total_price = response.data.total_price;
      let total_volume = response.data.total_volume;
      let total_count = response.data.total_count;
      let count = response.data.count;
      if (count) {
        this.setState({ count });
      }
      if (rowData) {
        this.setState({ rowData });
      }
      if (total_fees) {
        this.setState({ total_fees });
      }
      if (total_price) {
        this.setState({ total_price });
      }
      if (total_volume) {
        this.setState({ total_volume });
      }
      if (total_count) {
        this.setState({ total_count });
      }
    });
    getAPICall(
      "paired_currency?status=1&admin_user_id=" + this.state.currentUserId
    ).then((response) => {
      let cPaired = response.data;

      if (cPaired) {
        this.setState({ cPaired });
      }
    });
  }
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.setState({ gridApi: params.api });
    this.gridColumnApi = params.columnApi;
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.gridApi !== prevState.gridApi) {
      const dataSource = {
        getRows: (rowData) => {
          // Use startRow and endRow for sending pagination to Backend
          // params.startRow : Start Page
          // params.endRow : End Page
          const models = Object.entries(rowData.filterModel);

          const page = rowData.endRow / this.state.pageSize;
          let params = "?status=1&admin_user_id=" +  this.state.currentUserId +"&per_page=" + this.state.pageSize + "&page=" + page;
          models.forEach((field) => {
            const f = field[0];
            const fV = field[1]?.filter;
            params = `${params}&${f}=${fV}`;
          });
          getAPICall("get-all-orderHistory" +  params).then((res) => {
            rowData.successCallback([...res.data.result], res.data.count);
          });
        },
      };

      this.state.gridApi.setDatasource(dataSource);
    }
  }

  updateQUERY = (wallet_type, wallet_address, private_key, enter_password) => {
    const wlt_password = this.state.settings.wallet_password;
    const data = {
      wallet_type: wallet_type,
      wallet_address: wallet_address,
      private_key: private_key,
      admin_user_id: this.state.currentUserId,
    };
    if (wallet_address && private_key) {
      if (wlt_password == enter_password) {
        postAPICall("updatehotwallet", data).then((response) => {
          const rowData = response.data.table;
          this.setState({ rowData: rowData });
        });
        this.setState({ validPassword: true });
      } else {
        this.setState({ validPassword: false });
      }
    } else {
    }
  };
  // onGridReady = params => {
  //   this.gridApi = params.api
  //   this.gridColumnApi = params.columnApi
  // }
  filterData = (column, val) => {
    var filter = this.gridApi.getFilterInstance(column);
    var modelObj = null;
    if (val !== "all") {
      modelObj = {
        type: "equals",
        filter: val,
      };
    }
    filter.setModel(modelObj);
    this.gridApi.onFilterChanged();
  };

  filterSize = (val) => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val));
      this.setState({
        pageSize: val,
      });
    }
  };
  updateSearchQuery = (val) => {
    this.gridApi.setQuickFilter(val);
    this.setState({
      searchVal: val,
    });
  };

  refreshCard = () => {
    this.setState({ reload: true });
    setTimeout(() => {
      this.setState({
        reload: false,
        role: "All",
        selectStatus: "All",
        verified: "All",
        department: "All",
      });
    }, 500);
  };

  toggleCollapse = () => {
    this.setState((state) => ({ collapse: !state.collapse }));
  };
  onEntered = () => {
    this.setState({ status: "Opened" });
  };
  onEntering = () => {
    this.setState({ status: "Opening..." });
  };

  onEntered = () => {
    this.setState({ status: "Opened" });
  };
  onExiting = () => {
    this.setState({ status: "Closing..." });
  };
  onExited = () => {
    this.setState({ status: "Closed" });
  };
  removeCard = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const {
      rowData,
      cmcDATA,
      cPaired,
      total_fees,
      total_price,
      total_volume,
      total_count,
      columnDefs,
      blockchain_radio,
      defaultColDef,
      pageSize,
    } = this.state;
    let getPrice = {};
    const isFloat = (x) => {
      return !!(x % 1);
    };
    cmcDATA != null &&
      cmcDATA.map((item) => {
        if (item.is_paired) {
          if (item.symbol == "BTC") {
            getPrice.is_paired_btc = item.current_price_inr;
          } else if (item.symbol == "USDT") {
            getPrice.is_paired_usdt = item.current_price_inr;
          } else if (item.symbol == "INR") {
            getPrice.is_paired_inr = 1;
          } else {
            getPrice.is_paired_vrx = item.current_price_inr;
          }
        }
      });
    const NCard =
      total_fees != null &&
      cmcDATA != null &&
      cmcDATA?.map((item) => {
        let totl = total_fees[item?.symbol]
          ? Number(total_fees[item?.symbol]).toFixed(2)
          : 0;

        const cPairedCurrency =
          cPaired != null &&
          cPaired?.map((i2) => {
            let price = 1;
            if (getPrice[i2?.paired_with]) {
              price = getPrice[i2.paired_with];
            }
            let raw_price = item?.current_price_inr
              ? item?.current_price_inr
              : 1;
            let inrPrice =
              (parseFloat(totl) * parseFloat(raw_price)) / parseFloat(price);
            inrPrice = isFloat(inrPrice)
              ? parseFloat(inrPrice.toFixed(2))
              : inrPrice;
            let d = i2?.currency_coin + ": " + inrPrice + ", ";
            return d;
          });
        return (
          <>
            {totl ? (
              <Col xl="2" lg="4" sm="6">
                <StatisticsCard
                  key={item.name}
                  hideChart
                  iconRight
                  icon={
                    <Media object src={item?.icon} height="25" width="25" />
                  }
                  stat={item?.symbol}
                  total={totl}
                  statTitle={cPairedCurrency}
                />
              </Col>
            ) : (
              ""
            )}
          </>
        );
      });

    const PCard =
      total_price != null &&
      cmcDATA != null &&
      cmcDATA.map((item) => {
        let totl = total_price[item?.symbol]
          ? Number(total_price[item?.symbol]).toFixed(2)
          : 0;
        const cPairedCurrency =
          cPaired != null &&
          cPaired.map((i2) => {
            let price = 1;
            if (getPrice[i2?.paired_with]) {
              price = getPrice[i2?.paired_with];
            }
            let raw_price = item?.current_price_inr
              ? item?.current_price_inr
              : 1;
            let inrPrice =
              (parseFloat(totl) * parseFloat(raw_price)) / parseFloat(price);
            inrPrice = isFloat(inrPrice)
              ? parseFloat(inrPrice.toFixed(2))
              : inrPrice;
            let d = i2.currency_coin + ": " + inrPrice + ", ";
            return d;
          });
        return (
          <>
            {totl ? (
              <Col xl="2" lg="4" sm="6">
                <StatisticsCard
                  key={item.name}
                  hideChart
                  iconRight
                  icon={<Media object src={item.icon} height="25" width="25" />}
                  stat={item.symbol}
                  total={totl}
                  statTitle={cPairedCurrency}
                />
              </Col>
            ) : (
              ""
            )}
          </>
        );
      });
    const VCard =
      total_volume != null &&
      cmcDATA != null &&
      cmcDATA.map((item) => {
        let totl = total_volume[item.symbol]
          ? Number(total_volume[item.symbol]).toFixed(2)
          : 0;

        return (
          <>
            {totl ? (
              <Col xl="2" lg="4" sm="6">
                <StatisticsCard
                  key={item.name}
                  hideChart
                  iconRight
                  icon={<Media object src={item.icon} height="25" width="25" />}
                  stat={item.symbol}
                  total={totl}
                  statTitle=""
                />
              </Col>
            ) : (
              ""
            )}
          </>
        );
      });
    const TCard =
      total_count != null &&
      cmcDATA != null &&
      cmcDATA.map((item) => {
        let totl = total_count[item.symbol]
          ? Number(total_count[item.symbol]).toFixed(2)
          : 0;

        return (
          <>
            {totl ? (
              <Col xl="2" lg="4" sm="6">
                <StatisticsCard
                  key={item.name}
                  hideChart
                  iconRight
                  icon={<Media object src={item.icon} height="25" width="25" />}
                  stat={item.symbol}
                  total={totl}
                  statTitle=""
                />
              </Col>
            ) : (
              ""
            )}
          </>
        );
      });
    return (
      <React.Fragment>
        {NCard ? (
          <Row className="app-user-list">
            <Col sm="12">
              <h2>Total Earned Trade Fees</h2>
            </Col>
            {NCard}
          </Row>
        ) : (
          ""
        )}
        {PCard ? (
          <Row className="app-user-list">
            <Col sm="12">
              <h2>Total Executed Trade Price</h2>
            </Col>
            {PCard}
          </Row>
        ) : (
          ""
        )}
        {VCard ? (
          <Row className="app-user-list">
            <Col sm="12">
              <h2>Total Executed Trade Volume</h2>
            </Col>
            {VCard}
          </Row>
        ) : (
          ""
        )}
        {TCard ? (
          <Row className="app-user-list">
            <Col sm="12">
              <h2>Total Executed Count</h2>
            </Col>
            {TCard}
          </Row>
        ) : (
          ""
        )}
        <Row className="app-user-list">
          <Col sm="12"></Col>
          <Col sm="12">
            <Card>
              <CardBody>
                <div className="ag-theme-material ag-grid-table">
                  <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                    <div className="sort-dropdown">
                      <UncontrolledDropdown className="ag-dropdown p-1">
                        <DropdownToggle tag="div">
                          1 - {pageSize} of 150
                          <ChevronDown className="ml-50" size={15} />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(20)}
                          >
                            20
                          </DropdownItem>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(50)}
                          >
                            50
                          </DropdownItem>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(100)}
                          >
                            100
                          </DropdownItem>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(150)}
                          >
                            150
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <div className="">
                      <div className="h2 float-left">
                        Total Executed Order :{" "}
                        {this.state.count !== null ? this.state.count : 0 }
                      </div>
                    </div>
                    <div className="filter-actions d-flex">
                      <Input
                        className="w-50 mr-1 mb-1 mb-sm-0"
                        type="text"
                        placeholder="search..."
                        onChange={(e) => this.updateSearchQuery(e.target.value)}
                        value={this.state.searchVal}
                      />
                      <div className="dropdown actions-dropdown">
                        <UncontrolledButtonDropdown>
                          <DropdownToggle className="px-2 py-75" color="white">
                            Actions
                            <ChevronDown className="ml-50" size={15} />
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem tag="a">
                              <Trash2 size={15} />
                              <span className="align-middle ml-50">Delete</span>
                            </DropdownItem>
                            <DropdownItem tag="a">
                              <Clipboard size={15} />
                              <span className="align-middle ml-50">
                                Archive
                              </span>
                            </DropdownItem>
                            <DropdownItem tag="a">
                              <Printer size={15} />
                              <span className="align-middle ml-50">Print</span>
                            </DropdownItem>
                            <DropdownItem tag="a">
                              <Download size={15} />
                              <span
                                className="align-middle ml-50"
                                onClick={() => this.gridApi.exportDataAsCsv()}
                              >
                                CSV
                              </span>
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledButtonDropdown>
                      </div>
                    </div>
                  </div>
                  {this.state.rowData !== null ? (
                    <ContextLayout.Consumer>
                      {(context) => (
                        <AgGridReact
                          gridOptions={{}}
                          rowSelection="multiple"
                          defaultColDef={defaultColDef}
                          columnDefs={columnDefs}
                          rowData={rowData}
                          onGridReady={this.onGridReady}
                          colResizeDefault={"shift"}
                          animateRows={true}
                          floatingFilter={true}
                          pagination={true}
                          pivotPanelShow="always"
                          paginationPageSize={pageSize}
                          cacheBlockSize={pageSize}
                          rowModelType={"infinite"}
                          onPageChage={this.handleChange}
                          rowHeight={60}
                          resizable={true}
                          //gridAutoHeight={true}
                          //enableRtl={context.state.direction === "rtl"}
                        />
                      )}
                    </ContextLayout.Consumer>
                  ) : (
                    <>
                      <div className="float-left">
                        <Spinner color="primary" />
                      </div>
                      <h2 className="float-left ml-1">
                        System is Calculating All Orders.
                      </h2>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUserId: state.auth.login.user.user_id,
  };
};
export default connect(mapStateToProps)(UsersList);
