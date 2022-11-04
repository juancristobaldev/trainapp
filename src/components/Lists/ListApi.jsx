import React from "react";

function ListApi(props) {
    return (
      <section className={`${props.className} ${props.data.length === 0 && "empty"}`}>
        {props.error && props.onError()}
        {props.loading && props.onLoading()}
        {(!props.loading && !props.data.length ) && props.onEmpty()}
        {props.searchContents && (props.data.length > 0 && props.searchContents.length === 0) && props.onEmptySearch()}
        {props.searchContents ? props.searchContents === undefined ? [].map(props.render) : props.searchContents.map(props.render)
        :
        props.data === undefined ? [].map(props.render) : props.data.map(props.render)
        }
        {props.children}
      </section>
    );
  }

export {ListApi}