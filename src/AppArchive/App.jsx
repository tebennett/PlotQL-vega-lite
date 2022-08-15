import vegaEmbed from 'vega-embed';
import { createGraphQLClient, gql, request } from "@solid-primitives/graphql";
import { createSignal, createEffect, For, Show, mergeProps } from "solid-js";
import { timeFormat, isoParse } from "d3-time-format";
import YAML from 'yaml';

//import * as Aq from 'arquero';


const client = createGraphQLClient("http://localhost:8080/v1/graphql");

const format = timeFormat("%y-%m-%d");
const formatDate = (date) => format(isoParse(date));


const VegaController = (props) => {
const [sortDirection, setSortDirection] = createSignal();
const [action, setAction] = createSignal();

  const newProps = mergeProps(props);
  setAction(newProps.action);
  setSortDirection(newProps.setSortDirection);
  
  const [gdata] = client(
    newProps.query,
    () => ({ sortDirection: sortDirection(), action: action() })
  );

  
  

  let qt;
  const fn = (event) => {
    event.preventDefault();
    setAction(YAML.parse(qy.value));
  }

  let viz = <div id={newProps.tag}></div>;
document.body.appendChild(viz);

return (
  <div>
    <form onSubmit={fn}>
      <textarea rows="5" cols="50" id="qy" ref={qt} />

      <button>query</button>
    </form>
    
    
    <Show when={gdata()} fallback={<div>Loading...</div>}>
      <VegaBar info={gdata()["Disease"]}
                tag={newProps.tag} />
    </Show>
  </div>
);

}


const VegaBar = (props) => {
  //const [vspec, setSpec] = createSignal();
  const nprops = mergeProps(props);

  /*
  let jdata = Aq.from( nprops.info);
  jdata = jdata.objects();
  */
  
  //let tag = "vis";
//console.log(nprops.info)
  
  return (
    
    <div>
      { vegaEmbed(`#${nprops.tag}`, {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "A simple bar chart with embedded data.",
        width: 400,
        height: 400,
        data: { values: nprops.info },
        mark: "bar",
        encoding: {
          x: { field: "date", type: "temporal" },
          y: { field: "newCases", type: "quantitative" },
        },
      })}
    </div>
  );
}

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

  return (
    <VegaController
      tag={"vis"}
      action={{ newCases: { _gte: 300000 } }}
      sortDirection={{ date: "asc" }}
      query={gql`query ($sortDirection: [Disease_order_by!], $action: Disease_bool_exp) {
        Disease(order_by: $sortDirection, where: $action) {
          date
          newCases
        }
      }
     ` }
    />
  );
}

export default App;
