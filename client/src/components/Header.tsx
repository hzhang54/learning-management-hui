import React from "react";

// pass in title, subtitle and rightElement of the type HeaderProps
// the function returns a div of class name "header".
// within, is a div that contains a h1 with classname header__title, and print the string title
// then if rightElement exists, add a div that display the rightElement
const Header = ({ title, subtitle, rightElement }: HeaderProps) => {
  return (
    <div className="header">
      <div>
        <h1 className="header__title">{title}</h1>
        <p className="header__subtitle">{subtitle}</p>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};

export default Header;
