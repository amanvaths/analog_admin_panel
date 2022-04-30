import React, { Suspense, lazy } from "react"
import { Router, Switch, Route } from "react-router-dom"
import { history } from "./history"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import Spinner from "./components/@vuexy/spinner/Loading-spinner"
import knowledgeBaseCategory from "./views/pages/knowledge-base/Category"
import knowledgeBaseQuestion from "./views/pages/knowledge-base/Questions"
import { ContextLayout } from "./utility/context/Layout"

// Route-based code splitting
const analyticsDashboard = lazy(() =>
  import("./views/dashboard/analytics/AnalyticsDashboard")
)
const ecommerceDashboard = lazy(() =>
  import("./views/dashboard/ecommerce/EcommerceDashboard")
)
const email = lazy(() => import("./views/apps/email/Email"))
const chat = lazy(() => import("./views/apps/chat/Chat"))
const todo = lazy(() => import("./views/apps/todo/Todo"))
const calendar = lazy(() => import("./views/apps/calendar/Calendar"))
const shop = lazy(() => import("./views/apps/ecommerce/shop/Shop"))
const wishlist = lazy(() => import("./views/apps/ecommerce/wishlist/Wishlist"))
const checkout = lazy(() => import("./views/apps/ecommerce/cart/Cart"))
const productDetail = lazy(() => import("./views/apps/ecommerce/detail/Detail"))
const grid = lazy(() => import("./views/ui-elements/grid/Grid"))
const typography = lazy(() =>
  import("./views/ui-elements/typography/Typography")
)
const textutilities = lazy(() =>
  import("./views/ui-elements/text-utilities/TextUtilities")
)
const syntaxhighlighter = lazy(() =>
  import("./views/ui-elements/syntax-highlighter/SyntaxHighlighter")
)
const colors = lazy(() => import("./views/ui-elements/colors/Colors"))
const reactfeather = lazy(() =>
  import("./views/ui-elements/icons/FeatherIcons")
)
const basicCards = lazy(() => import("./views/ui-elements/cards/basic/Cards"))
const statisticsCards = lazy(() =>
  import("./views/ui-elements/cards/statistics/StatisticsCards")
)
const analyticsCards = lazy(() =>
  import("./views/ui-elements/cards/analytics/Analytics")
)
const actionCards = lazy(() =>
  import("./views/ui-elements/cards/actions/CardActions")
)
const Alerts = lazy(() => import("./components/reactstrap/alerts/Alerts"))
const Buttons = lazy(() => import("./components/reactstrap/buttons/Buttons"))
const Breadcrumbs = lazy(() =>
  import("./components/reactstrap/breadcrumbs/Breadcrumbs")
)
const Carousel = lazy(() => import("./components/reactstrap/carousel/Carousel"))
const Collapse = lazy(() => import("./components/reactstrap/collapse/Collapse"))
const Dropdowns = lazy(() =>
  import("./components/reactstrap/dropdowns/Dropdown")
)
const ListGroup = lazy(() =>
  import("./components/reactstrap/listGroup/ListGroup")
)
const Modals = lazy(() => import("./components/reactstrap/modal/Modal"))
const Pagination = lazy(() =>
  import("./components/reactstrap/pagination/Pagination")
)
const NavComponent = lazy(() =>
  import("./components/reactstrap/navComponent/NavComponent")
)
const Navbar = lazy(() => import("./components/reactstrap/navbar/Navbar"))
const Tabs = lazy(() => import("./components/reactstrap/tabs/Tabs"))
const TabPills = lazy(() => import("./components/reactstrap/tabPills/TabPills"))
const Tooltips = lazy(() => import("./components/reactstrap/tooltips/Tooltips"))
const Popovers = lazy(() => import("./components/reactstrap/popovers/Popovers"))
const Badge = lazy(() => import("./components/reactstrap/badge/Badge"))
const BadgePill = lazy(() =>
  import("./components/reactstrap/badgePills/BadgePill")
)
const Progress = lazy(() => import("./components/reactstrap/progress/Progress"))
const Media = lazy(() => import("./components/reactstrap/media/MediaObject"))
const Spinners = lazy(() => import("./components/reactstrap/spinners/Spinners"))
const Toasts = lazy(() => import("./components/reactstrap/toasts/Toasts"))
const avatar = lazy(() => import("./components/@vuexy/avatar/Avatar"))
const AutoComplete = lazy(() =>
  import("./components/@vuexy/autoComplete/AutoComplete")
)
const chips = lazy(() => import("./components/@vuexy/chips/Chips"))
const divider = lazy(() => import("./components/@vuexy/divider/Divider"))
const vuexyWizard = lazy(() => import("./components/@vuexy/wizard/Wizard"))
const listView = lazy(() => import("./views/ui-elements/data-list/ListView"))
const thumbView = lazy(() => import("./views/ui-elements/data-list/ThumbView"))
const select = lazy(() => import("./views/forms/form-elements/select/Select"))
const switchComponent = lazy(() =>
  import("./views/forms/form-elements/switch/Switch")
)
const checkbox = lazy(() =>
  import("./views/forms/form-elements/checkboxes/Checkboxes")
)
const radio = lazy(() => import("./views/forms/form-elements/radio/Radio"))
const input = lazy(() => import("./views/forms/form-elements/input/Input"))
const group = lazy(() =>
  import("./views/forms/form-elements/input-groups/InputGoups")
)
const numberInput = lazy(() =>
  import("./views/forms/form-elements/number-input/NumberInput")
)
const textarea = lazy(() =>
  import("./views/forms/form-elements/textarea/Textarea")
)
const pickers = lazy(() =>
  import("./views/forms/form-elements/datepicker/Pickers")
)
const inputMask = lazy(() =>
  import("./views/forms/form-elements/input-mask/InputMask")
)
const layout = lazy(() => import("./views/forms/form-layouts/FormLayouts"))
const formik = lazy(() => import("./views/forms/formik/Formik"))
const tables = lazy(() => import("./views/tables/reactstrap/Tables"))
const ReactTables = lazy(() =>
  import("./views/tables/react-tables/ReactTables")
)
const Aggrid = lazy(() => import("./views/tables/aggrid/Aggrid"))
const DataTable = lazy(() => import("./views/tables/data-tables/DataTables"))
const profile = lazy(() => import("./views/pages/profile/Profile"))
const faq = lazy(() => import("./views/pages/faq/FAQ"))
const knowledgeBase = lazy(() =>
  import("./views/pages/knowledge-base/KnowledgeBase")
)
const search = lazy(() => import("./views/pages/search/Search"))
const accountSettings = lazy(() =>
  import("./views/pages/account-settings/AccountSettings")
)
const invoice = lazy(() => import("./views/pages/invoice/Invoice"))
const comingSoon = lazy(() => import("./views/pages/misc/ComingSoon"))
const error404 = lazy(() => import("./views/pages/misc/error/404"))
const error500 = lazy(() => import("./views/pages/misc/error/500"))
const authorized = lazy(() => import("./views/pages/misc/NotAuthorized"))
const maintenance = lazy(() => import("./views/pages/misc/Maintenance"))
const apex = lazy(() => import("./views/charts/apex/ApexCharts"))
const chartjs = lazy(() => import("./views/charts/chart-js/ChartJS"))
const extreme = lazy(() => import("./views/charts/recharts/Recharts"))
const leafletMaps = lazy(() => import("./views/maps/Maps"))
const toastr = lazy(() => import("./extensions/toastify/Toastify"))
const sweetAlert = lazy(() => import("./extensions/sweet-alert/SweetAlert"))
const rcSlider = lazy(() => import("./extensions/rc-slider/Slider"))
const uploader = lazy(() => import("./extensions/dropzone/Dropzone"))
const editor = lazy(() => import("./extensions/editor/Editor"))
const drop = lazy(() => import("./extensions/drag-and-drop/DragAndDrop"))
const tour = lazy(() => import("./extensions/tour/Tour"))
const clipboard = lazy(() =>
  import("./extensions/copy-to-clipboard/CopyToClipboard")
)
const menu = lazy(() => import("./extensions/contexify/Contexify"))
const swiper = lazy(() => import("./extensions/swiper/Swiper"))
const i18n = lazy(() => import("./extensions/i18n/I18n"))
const reactPaginate = lazy(() => import("./extensions/pagination/Pagination"))
const tree = lazy(() => import("./extensions/treeview/TreeView"))
const Import = lazy(() => import("./extensions/import-export/Import"))
const Export = lazy(() => import("./extensions/import-export/Export"))
const ExportSelected = lazy(() =>
  import("./extensions/import-export/ExportSelected")
)
//const pendinguser   = lazy(() => import("./views/apps/user/pendinguser"))
//const rejecteduser  = lazy(() => import("./views/apps/user/rejecteduser"))
//const verifieduser  = lazy(() => import("./views/apps/user/verifieduser"))

const pendingwithdraw   = lazy(() => import("./views/apps/withdraw/pendingwithdraw"))
const rejectedwithdraw  = lazy(() => import("./views/apps/withdraw/rejectedwithdraw"))
const verifiedwithdraw  = lazy(() => import("./views/apps/withdraw/verifiedwithdraw"))

const alluser = lazy(() => import("./views/apps/user/alluser"))
const blockuser     = lazy(() => import("./views/apps/user/blockuser"))
const levelreport = lazy(() => import("./views/apps/user/levelreport"))
const addpresale = lazy(() => import("./views/apps/user/addpresale"))
const presalelist = lazy(() => import("./views/apps/user/presalelist"))
const Bonuspercent = lazy(() => import("./views/apps/user/Bonuspercent"))
const EditPresale = lazy(() => import("./views/apps/user/EditPresale"))
//const bankverified      = lazy(() => import("./views/apps/user/bankverified"))
//onst bankrejected      = lazy(() => import("./views/apps/user/bankrejected"))
//const bankpending      = lazy(() => import("./views/apps/user/bankpending"))

const coldwallet      = lazy(() => import("./views/apps/wallets/coldwallet"))
const capturefundhistory      = lazy(() => import("./views/apps/wallets/capturefundhistory"))
const adminsendcapture      = lazy(() => import("./views/apps/wallets/adminsendcapture"))
const capturehits      = lazy(() => import("./views/apps/wallets/capturehits"))
const hotwallet      = lazy(() => import("./views/apps/wallets/hotwallet"))
const tradefeeswallet      = lazy(() => import("./views/apps/wallets/tradefeeswallet"))
const withdrawfeeswallet      = lazy(() => import("./views/apps/wallets/withdrawfeeswallet"))

const AddToken      = lazy(() => import("./views/apps/token/AddToken"))
const edittoken      = lazy(() => import("./views/apps/token/edittoken"))
const crptoSetting      = lazy(() => import("./views/apps/token/crptosetting"))
const crptoLimit      = lazy(() => import("./views/apps/token/crptolimit"))
const createPairing      = lazy(() => import("./views/apps/token/createpairing"))
const setPairing      = lazy(() => import("./views/apps/token/setpairing"))

const openbuy      = lazy(() => import("./views/apps/order/openbuy"))
const opensell      = lazy(() => import("./views/apps/order/opensell"))
const excutedbuysell      = lazy(() => import("./views/apps/order/excutedbuysell"))
const canclebuyorder      = lazy(() => import("./views/apps/order/canclebuyorder"))
const canclesellorder      = lazy(() => import("./views/apps/order/canclesellorder"))
const createorder      = lazy(() => import("./views/apps/order/createorder"))

const addemployee      = lazy(() => import("./views/apps/master/addemployee"))
const mastersetting      = lazy(() => import("./views/apps/master/mastersetting"))

const logobanner      = lazy(() => import("./views/apps/setting/logobanner"))
const addnewpage      = lazy(() => import("./views/apps/setting/addnewpage"))
const addnewmenu      = lazy(() => import("./views/apps/setting/addnewmenu"))
const apisetting      = lazy(() => import("./views/apps/setting/apisetting"))
const stakesetting      = lazy(() => import("./views/apps/setting/stakesetting"))
const currencysetting      = lazy(() => import("./views/apps/setting/currencysetting"))
const remotetrading      = lazy(() => import("./views/apps/setting/remotetrading"))

const usertradefund      = lazy(() => import("./views/apps/finance/usertradefund"))
const userwalletfund      = lazy(() => import("./views/apps/finance/userwalletfund"))
const deposithistory      = lazy(() => import("./views/apps/finance/deposithistory"))
const withdrawistory      = lazy(() => import("./views/apps/finance/withdrawistory"))
const userdeposithistory      = lazy(() => import("./views/apps/finance/userdeposithistory"))
const userwithdrawistory      = lazy(() => import("./views/apps/finance/userwithdrawistory"))
const adduserfund      = lazy(() => import("./views/apps/finance/adduserfund"))
const withdrawinrfromuser      = lazy(() => import("./views/apps/finance/withdrawinrfromuser"))
const depositinrfromuser      = lazy(() => import("./views/apps/finance/depositinrfromuser"))
const capturefundfromuser      = lazy(() => import("./views/apps/finance/capturefundfromuser"))
const Realfundtranfertouser      = lazy(() => import("./views/apps/finance/realfundtranfertouser"))
const withdrawalfeesreport      = lazy(() => import("./views/apps/finance/withdrawalfeesreport"))
const stakehistory      = lazy(() => import("./views/apps/finance/stakehistory"))
const stakehistorydaily      = lazy(() => import("./views/apps/finance/stakehistorydaily"))

const refferrellist      = lazy(() => import("./views/apps/bonus/refferrellist"))
const refferrellistnotkyc      = lazy(() => import("./views/apps/bonus/refferrellistnotkyc"))
const airdroplist      = lazy(() => import("./views/apps/bonus/airdroplist"))

const UserEdit = lazy(() => import("./views/apps/user/edit/Edit"))
const userView = lazy(() => import("./views/apps/user/view/View"))
const Login = lazy(() => import("./views/pages/authentication/login/Login"))
const forgotPassword = lazy(() =>
  import("./views/pages/authentication/ForgotPassword")
)
const lockScreen = lazy(() => import("./views/pages/authentication/LockScreen"))
const resetPassword = lazy(() =>
  import("./views/pages/authentication/ResetPassword")
)
const register = lazy(() =>
  import("./views/pages/authentication/register/Register")
)
const accessControl = lazy(() =>
  import("./extensions/access-control/AccessControl")
)
// Set Layout and Component Using App Route
const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return (
        <ContextLayout.Consumer>
          {context => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout
            return (
              <LayoutTag {...props} permission={props.user}>
                <Suspense fallback={<Spinner />}>
                  {rest.isLoggedIn ? (
                      <Component {...props} />
                    ) : (
                      <>
                      <Redirect to="/pages/login" />
                      <Component {...props} />
                      </>
                  )} 
                  
                </Suspense>
              </LayoutTag>
            )
          }}
        </ContextLayout.Consumer>
      )
    }}
  />
)
const mapStateToProps = state => {
  return {
    user: state.auth.login.userRole,
    isLoggedIn: state.auth.login.isLoggedIn,
    userID: state.auth.login.user.user_id
  }
}

const AppRoute = connect(mapStateToProps)(RouteConfig)

class AppRouter extends React.Component {
  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        <Switch>
          <AppRoute exact path="/" component={analyticsDashboard} />
          <AppRoute
            path="/ecommerce-dashboard"
            component={ecommerceDashboard}
          />
          <AppRoute
            path="/email"
            exact
            component={() => <Redirect to="/email/inbox" />}
          />
          <AppRoute path="/email/:filter" component={email} />
          <AppRoute path="/chat" component={chat} />
          <AppRoute
            path="/todo"
            exact
            component={() => <Redirect to="/todo/all" />}
          />
          <AppRoute path="/todo/:filter" component={todo} />
          <AppRoute path="/calendar" component={calendar} />
          <AppRoute path="/ecommerce/shop" component={shop} />
          <AppRoute path="/ecommerce/wishlist" component={wishlist} />
          <AppRoute
            path="/ecommerce/product-detail"
            component={productDetail}
          />
          <AppRoute
            path="/ecommerce/checkout"
            component={checkout}
            permission="admin"
          />
          <AppRoute path="/data-list/list-view" component={listView} />
          <AppRoute path="/data-list/thumb-view" component={thumbView} />
          <AppRoute path="/ui-element/grid" component={grid} />
          <AppRoute path="/ui-element/typography" component={typography} />
          <AppRoute
            path="/ui-element/textutilities"
            component={textutilities}
          />
          <AppRoute
            path="/ui-element/syntaxhighlighter"
            component={syntaxhighlighter}
          />
          <AppRoute path="/colors/colors" component={colors} />
          <AppRoute path="/icons/reactfeather" component={reactfeather} />
          <AppRoute path="/cards/basic" component={basicCards} />
          <AppRoute path="/cards/statistics" component={statisticsCards} />
          <AppRoute path="/cards/analytics" component={analyticsCards} />
          <AppRoute path="/cards/action" component={actionCards} />
          <AppRoute path="/components/alerts" component={Alerts} />
          <AppRoute path="/components/buttons" component={Buttons} />
          <AppRoute path="/components/breadcrumbs" component={Breadcrumbs} />
          <AppRoute path="/components/carousel" component={Carousel} />
          <AppRoute path="/components/collapse" component={Collapse} />
          <AppRoute path="/components/dropdowns" component={Dropdowns} />
          <AppRoute path="/components/list-group" component={ListGroup} />
          <AppRoute path="/components/modals" component={Modals} />
          <AppRoute path="/components/pagination" component={Pagination} />
          <AppRoute path="/components/nav-component" component={NavComponent} />
          <AppRoute path="/components/navbar" component={Navbar} />
          <AppRoute path="/components/tabs-component" component={Tabs} />
          <AppRoute path="/components/pills-component" component={TabPills} />
          <AppRoute path="/components/tooltips" component={Tooltips} />
          <AppRoute path="/components/popovers" component={Popovers} />
          <AppRoute path="/components/badges" component={Badge} />
          <AppRoute path="/components/pill-badges" component={BadgePill} />
          <AppRoute path="/components/progress" component={Progress} />
          <AppRoute path="/components/media-objects" component={Media} />
          <AppRoute path="/components/spinners" component={Spinners} />
          <AppRoute path="/components/toasts" component={Toasts} />
          <AppRoute
            path="/extra-components/auto-complete"
            component={AutoComplete}
          />
          <AppRoute path="/extra-components/avatar" component={avatar} />
          <AppRoute path="/extra-components/chips" component={chips} />
          <AppRoute path="/extra-components/divider" component={divider} />
          <AppRoute path="/forms/wizard" component={vuexyWizard} />
          <AppRoute path="/forms/elements/select" component={select} />
          <AppRoute path="/forms/elements/switch" component={switchComponent} />
          <AppRoute path="/forms/elements/checkbox" component={checkbox} />
          <AppRoute path="/forms/elements/radio" component={radio} />
          <AppRoute path="/forms/elements/input" component={input} />
          <AppRoute path="/forms/elements/input-group" component={group} />
          <AppRoute
            path="/forms/elements/number-input"
            component={numberInput}
          />
          <AppRoute path="/forms/elements/textarea" component={textarea} />
          <AppRoute path="/forms/elements/pickers" component={pickers} />
          <AppRoute path="/forms/elements/input-mask" component={inputMask} />
          <AppRoute path="/forms/layout/form-layout" component={layout} />
          <AppRoute path="/forms/formik" component={formik} />{" "}
          <AppRoute path="/tables/reactstrap" component={tables} />
          <AppRoute path="/tables/react-tables" component={ReactTables} />
          <AppRoute path="/tables/agGrid" component={Aggrid} />
          <AppRoute path="/tables/data-tables" component={DataTable} />
          <AppRoute path="/pages/profile" component={profile} />
          <AppRoute path="/pages/faq" component={faq} />
          <AppRoute
            path="/pages/knowledge-base"
            component={knowledgeBase}
            exact
          />
          <AppRoute
            path="/pages/knowledge-base/category"
            component={knowledgeBaseCategory}
            exact
          />
          <AppRoute
            path="/pages/knowledge-base/category/questions"
            component={knowledgeBaseQuestion}
          />
          <AppRoute path="/pages/search" component={search} />
          <AppRoute
            path="/pages/account-settings"
            component={accountSettings}
          />
          <AppRoute path="/pages/invoice" component={invoice} />
          <AppRoute
            path="/misc/coming-soon"
            component={comingSoon}
            fullLayout
          />
          <AppRoute path="/misc/error/404" component={error404} fullLayout />
          <AppRoute path="/pages/login" component={Login} fullLayout />
          <AppRoute path="/pages/register" component={register} fullLayout />
          <AppRoute
            path="/pages/forgot-password"
            component={forgotPassword}
            fullLayout
          />
          <AppRoute
            path="/pages/lock-screen"
            component={lockScreen}
            fullLayout
          />
          <AppRoute
            path="/pages/reset-password"
            component={resetPassword}
            fullLayout
          />
          <AppRoute path="/misc/error/500" component={error500} fullLayout />
          <AppRoute
            path="/misc/not-authorized"
            component={authorized}
            fullLayout
          />
          <AppRoute
            path="/misc/maintenance"
            component={maintenance}
            fullLayout
          />
          {/* <AppRoute path="/app/user/pendinguser" component={pendinguser} /> */}
          {/* <AppRoute path="/app/user/verifieduser" component={verifieduser}  /> */}
          {/* <AppRoute path="/app/user/rejecteduser" component={rejecteduser}  /> */}

          <AppRoute path="/app/withdraw/pendingwithdraw" component={pendingwithdraw} />
          <AppRoute path="/app/withdraw/verifiedwithdraw" component={verifiedwithdraw}  />
          <AppRoute path="/app/withdraw/rejectedwithdraw" component={rejectedwithdraw}  />

          <AppRoute path="/app/user/alluser" component={alluser} />
          <AppRoute path="/app/user/levelreport" component={levelreport} />
          <AppRoute path="/app/user/addpresale" component={addpresale} />
          <AppRoute path="/app/user/presalelist" component={presalelist} />
          <AppRoute path="/app/user/bonuspercent" component={Bonuspercent} />
          <AppRoute path="/app/user/blockuser" component={blockuser} />
          <AppRoute path="/app/user/editpresale:presale_id" component={EditPresale} />

          {/* <AppRoute path="/app/user/bankverified" component={bankverified} /> */}
          {/* <AppRoute path="/app/user/bankrejected" component={bankrejected} /> */}
         {/* <AppRoute path="/app/user/bankpending" component={bankpending} /> */}
          <AppRoute path="/app/user/edit" component={(props) => <UserEdit {...props} />} />
          <AppRoute path="/app/user/view" component={userView} />

          <AppRoute path="/app/wallets/coldwallet" component={coldwallet} />
          <AppRoute path="/app/wallets/capturefundhistory" component={capturefundhistory} />
          <AppRoute path="/app/wallets/adminsendcapture" component={adminsendcapture} />
          <AppRoute path="/app/wallets/capturehits" component={capturehits} />
          <AppRoute path="/app/wallets/hotwallet" component={hotwallet} />
          <AppRoute path="/app/wallets/tradefeeswallet" component={tradefeeswallet} />
          <AppRoute path="/app/wallets/withdrawfeeswallet" component={withdrawfeeswallet} />
          
          <AppRoute path="/app/token/addtoken" component={AddToken} />
          <AppRoute path="/app/token/edittoken" component={edittoken} />
          <AppRoute path="/app/token/crptosetting" component={crptoSetting} />
          <AppRoute path="/app/token/crptolimit" component={crptoLimit} />
          <AppRoute path="/app/token/createpairing" component={createPairing} />
          <AppRoute path="/app/token/setpairing" component={setPairing} />

          <AppRoute path="/app/order/openbuy" component={openbuy} />
          <AppRoute path="/app/order/opensell" component={opensell} />
          <AppRoute path="/app/order/excutedbuysell" component={excutedbuysell} />
          <AppRoute path="/app/order/canclebuyorder" component={canclebuyorder} />
          <AppRoute path="/app/order/canclesellorder" component={canclesellorder} />
          <AppRoute path="/app/order/createorder" component={createorder} />
          
          <AppRoute path="/app/finance/usertradefund" component={usertradefund} />
          <AppRoute path="/app/finance/userwalletfund" component={userwalletfund} />
          <AppRoute path="/app/finance/deposithistory" component={deposithistory} />
          <AppRoute path="/app/finance/withdrawistory" component={withdrawistory} />
          <AppRoute path="/app/finance/userdeposithistory" component={userdeposithistory} />
          <AppRoute path="/app/finance/userwithdrawistory" component={userwithdrawistory} />
          <AppRoute path="/app/finance/adduserfund" component={adduserfund} />
          <AppRoute path="/app/finance/withdrawinrfromuser" component={withdrawinrfromuser} />
          <AppRoute path="/app/finance/depositinrfromuser" component={depositinrfromuser} />
          <AppRoute path="/app/finance/capturefundfromuser" component={capturefundfromuser} />
          <AppRoute path="/app/finance/realfundtranfertouser" component={(props) => <Realfundtranfertouser {...props} />} />
          <AppRoute path="/app/finance/withdrawalfeesreport" component={withdrawalfeesreport} />
          <AppRoute path="/app/finance/stakehistory" component={stakehistory} />
          <AppRoute path="/app/finance/stakehistorydaily" component={stakehistorydaily} />

          <AppRoute path="/app/bonus/refferrellist" component={refferrellist} />
          <AppRoute path="/app/bonus/refferrellistnotkyc" component={refferrellistnotkyc} />
          <AppRoute path="/app/bonus/airdroplist" component={airdroplist} />

          <AppRoute path="/app/master/addemployee" component={addemployee} />
          <AppRoute path="/app/master/mastersetting" component={mastersetting} />
          
          <AppRoute path="/app/setting/logobanner" component={logobanner} />
          <AppRoute path="/app/setting/addnewpage" component={addnewpage} />
          <AppRoute path="/app/setting/addnewmenu" component={addnewmenu} />
          <AppRoute path="/app/setting/apisetting" component={apisetting} />
          <AppRoute path="/app/setting/stakesetting" component={stakesetting} />
          <AppRoute path="/app/setting/currencysetting" component={currencysetting} />
          <AppRoute path="/app/setting/remotetrading" component={remotetrading} />

          <AppRoute path="/charts/apex" component={apex} />
          <AppRoute path="/charts/chartjs" component={chartjs} />
          <AppRoute path="/charts/recharts" component={extreme} />
          <AppRoute path="/maps/leaflet" component={leafletMaps} />
          <AppRoute path="/extensions/sweet-alert" component={sweetAlert} />
          <AppRoute path="/extensions/toastr" component={toastr} />
          <AppRoute path="/extensions/slider" component={rcSlider} />
          <AppRoute path="/extensions/file-uploader" component={uploader} />
          <AppRoute path="/extensions/wysiwyg-editor" component={editor} />
          <AppRoute path="/extensions/drag-and-drop" component={drop} />
          <AppRoute path="/extensions/tour" component={tour} />
          <AppRoute path="/extensions/clipboard" component={clipboard} />
          <AppRoute path="/extensions/context-menu" component={menu} />
          <AppRoute path="/extensions/swiper" component={swiper} />
          <AppRoute
            path="/extensions/access-control"
            component={accessControl}
          />
          <AppRoute path="/extensions/i18n" component={i18n} />
          <AppRoute path="/extensions/tree" component={tree} />
          <AppRoute path="/extensions/import" component={Import} />
          <AppRoute path="/extensions/export" component={Export} />
          <AppRoute
            path="/extensions/export-selected"
            component={ExportSelected}
          />
          <AppRoute path="/extensions/pagination" component={reactPaginate} />
          <AppRoute component={error404} fullLayout />
        </Switch>
      </Router>
    )
  }
}

export default AppRouter
