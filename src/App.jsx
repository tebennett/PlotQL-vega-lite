import vegaEmbed from "vega-embed";
import { createGraphQLClient, gql, request } from "@solid-primitives/graphql";
import { createSignal, createEffect, For, Show, mergeProps } from "solid-js";
import { createStore } from "solid-js/store";
import { timeFormat, isoParse } from "d3-time-format";
import YAML from "yaml";
import * as R from "ramda";
import "purecss/build/pure-min.css";

import * as Aq from "arquero";
 
const format = timeFormat("%y-%m-%d");
const formatDate = (date) => format(isoParse(date));
const [dataLink, setDataLink] = createStore({});

const VegaLine = (props) => {
  const lprops = mergeProps(props);

  //   vegaEmbed(`#${lprops.tag}`,

  return (
    <div>
      {vegaEmbed(`#${lprops.tag}`, {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "A simple line chart with embedded data.",
        width: 400,
        height: 400,
        data: { values: lprops.info },
        mark: "line",
        encoding: {
          x: { field: "ORDERDATE", type: "temporal" },
          y: { field: "SALES", type: "quantitative" },
        },
      })}
    </div>
  );
};

const VegaBar = (props) => {
  //const [vspec, setSpec] = createSignal();
  const nprops = mergeProps(props);

  /*
  let jdata = Aq.from( nprops.info);
  jdata = jdata.objects();
  console.log(jdata);
/*
`#${nprops.tag}`,

  */

  //let tag = "vis";
  //console.log(nprops.info)

  return (
    <div>
      {vegaEmbed(`#${nprops.tag}`, {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "A simple bar chart with embedded data.",
        width: 400,
        height: 400,
        data: { values: nprops.info },
        mark: "bar",
        encoding: {
          x: { field: "ORDERDATE", type: "temporal" },
          y: { field: "SALES", type: "quantitative" },
        },
      })}
    </div>
  );
};

const items = {
  bar: VegaBar,
  line: VegaLine,
};

const VegaController = (props) => {
  const client = createGraphQLClient("http://localhost:8080/v1/graphql");

  const [sortDirection, setSortDirection] = createSignal();
  const [action, setAction] = createSignal();
  const [selected, setSelected] = createSignal("bar");
  const newProps = mergeProps(props);
  setAction(newProps.action);
  setSortDirection(newProps.sortDirection);

  setDataLink(
    R.fromPairs([
      [
        `${newProps.tag}`,
        {
          keyID: `ID-${newProps.tag}`,
          query: newProps.query,
          sort: newProps.sortDirection,
          where: newProps.action,
          filter: "(Sales.SALES)[[0..20]]",
          dataNode: {},
        },
      ],
    ])
  );

  const [gdata] = client(dataLink[newProps.tag].query, () => ({
    sortDirection: sortDirection(),
    action: dataLink[newProps.tag].where,
  }));

  let qt;
  const fn = (event) => {
    event.preventDefault();
    //let vtx = document.getElementById(`tx${newProps.tag}`);
    setDataLink(`${newProps.tag}`, { where: YAML.parse(qt.value) });
    // setAction(YAML.parse(qt.value));
  };
  /*
  let viz =  <div id={newProps.tag}></div> ;
document.body.appendChild(viz);
setAction(YAML.parse(qt.value));
<textarea rows="5" cols="50"  id={`tx${newProps.tag}`} ref={qt} />
<VegaBar info={gdata()["Disease"]}
                tag={newProps.tag} />
*/

  return (
    <div>
      <form onSubmit={fn} className="pure-form pure-form-stacked">
        <textarea className="pure-input-1-2" rows="5" cols="50" ref={qt} />
        <br />
        <button className="pure-button">query</button>
      </form>

      <Show when={gdata()} fallback={<div>Loading...</div>}>
        {setDataLink(`${newProps.tag}`, { dataNode: gdata()["Sales"] })}
        <br />

        <Dynamic
          component={newProps.chart}
          info={gdata()["Sales"]}
          tag={newProps.tag}
        />
      </Show>
      <div id={newProps.tag}></div>
    </div>
  );
};

const DesignGrid = (props) => {
  const designProps = mergeProps(props);

  let dgt;
  const dgn = (event) => {
    event.preventDefault();
    //let dgx = document.getElementById(`dgx${designProps.tag}`);
    setDataLink(`${designProps.tag}`, { where: YAML.parse(dgt.value) });
    //setAction(YAML.parse(vtx.value));
  };

  return (
    <div>
      <div class="pure-menu pure-menu-horizontal">
        <ul class="pure-menu-list">
          <li class="pure-menu-item pure-menu-selected">
            <a href="#" class="pure-menu-link">
              Home
            </a>
          </li>
          <li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
            <a href="#" id="menuLink1" class="pure-menu-link">
              Contact
            </a>
            <ul class="pure-menu-children">
              <li class="pure-menu-item">
                <a href="#" class="pure-menu-link">
                  Email
                </a>
              </li>
              <li class="pure-menu-item">
                <a href="#" class="pure-menu-link">
                  Twitter
                </a>
              </li>
              <li class="pure-menu-item">
                <a href="#" class="pure-menu-link">
                  Tumblr Blog
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div>
        <form onSubmit={dgn} className="pure-form pure-form-stacked">
          <textarea className="pure-input-1-2" rows="5" cols="50" ref={dgt} />
          <br />
          <button className="pure-button">query</button>
        </form>
      </div>
    </div>
  );
};

const DataGrid = (props) => {
  //let rslt = from(dataLink$);
  //console.log(rslt);
  const dprops = mergeProps(props);
  //const pred = R.whereAny({name: R.equals(`${dprops.tag}`), dataNode: R.equals(R.__)});
  //if (R.find(pred,dataLink) != undefined)
  //const dl = R.filter(pred, dataLink)[0].dataNode;
  //console.log( R.filter(pred, dataLink)[0].dataNode );
  //const tbl = Aq.from(dprops.info);
  // if (dataLink != undefined)
  //console.log(dataLink[dprops.tag]);
  /*
{ document.getElementById(`tbldg${dprops.tag}`).innerHTML = Aq.from(
    dataLink[dprops.tag] == undefined ? {} : dataLink[dprops.tag].dataNode
  ).toHTML() }

<table className="pure-table pure-table-bordered">
        <div id={`tbldg${dprops.tag}`}></div>
      </table>

  */

  createEffect(() => {
    let tbl = Aq.from(
      dataLink[dprops.tag] == undefined ? {} : dataLink[dprops.tag].dataNode
    ).toHTML();
    document.getElementById(`tbldg${dprops.tag}`).innerHTML = tbl;
  });

  return (
    <div style={"max-height: 300px;overflow-y: scroll;"}>
      <table
        className="pure-table pure-table-bordered"
        id={`tbldg${dprops.tag}`}
      ></table>
    </div>
  );
};

function App() {
  /*
let VlSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  description: 'A simple bar chart with embedded data.',
  data: gdata()["Disease"],
  mark: 'bar',
  encoding: {
    x: {field: 'date', type: 'temporal'},
    y: {field: 'newCases', type: 'quantitative'}
  }
};
*/

  /*
let jdata = Aq.from( gdata()).objects();
  
  jdata.print()
  jdata = jdata.objects();
*/

  let mdiv;

  return (
    <div className="pure-g">
      <div className="pure-u-1-2">
        <div>
          <DesignGrid tag={"ivs"} />
        </div>
        <div>
          <DataGrid tag={"ivs"} />
        </div>
      </div>
      <div className="pure-u-1-2">
        <VegaController
          chart={VegaBar}
          tag={"ivs"}
          action={ { SALES: { _lte: 900 } } }
          sortDirection={{ ORDERDATE: "asc" }}
          query={gql`
          query (
            $sortDirection: [Sales_order_by!]
            $action: Sales_bool_exp
          ) {
            Sales(order_by: $sortDirection, where: $action) {
              ORDERDATE
              SALES
            }
          }
        `}
        />
      </div>
      <div className="pure-u-1-2">
        <div>
          <DesignGrid tag={"vis"} />
        </div>
        <div>
          <DataGrid tag={"vis"} />
        </div>
      </div>
      <div className="pure-u-1-2">
        <VegaController
          chart={VegaLine}
          tag={"vis"}
          action={ { SALES: { _lte: 900 } }  }
          sortDirection={{ ORDERDATE: "asc" }}
          query={gql`
          query (
            $sortDirection: [Sales_order_by!]
            $action: Sales_bool_exp
          ) {
            Sales(order_by: $sortDirection, where: $action) {
              ORDERDATE
              SALES
            }
          }
        `}
        />
      </div>
    </div>
  );
}

export default App;
