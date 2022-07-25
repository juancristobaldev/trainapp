import React from "react";

function ListApi(props) {
    return (
      <section className="ListRoutines-container">
        {props.error && props.onError()}
        {props.loading && props.onLoading()}
        {(!props.loading && props.total === 0) && props.onEmpty()}
        {props.data.map(props.render)}
      </section>
    );
  }

export {ListApi}