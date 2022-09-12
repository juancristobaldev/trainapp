import React from "react";

function ListApi(props) {

    return (
      <section className={props.className}>
        {props.error && props.onError()}
        {props.loading && props.onLoading()}
        {(!props.loading && !props.data.length ) && props.onEmpty()}
        {props.data === undefined ? [].map(props.render) : props.data.map(props.render)}
      </section>
    );
  }

export {ListApi}