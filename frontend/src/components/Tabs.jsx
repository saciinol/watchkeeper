const Tabs = ({ active, onChange, tabs }) => {
  return (
    <div className="tabs tabs-boxed mb-6 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`tab ${active === tab.value ? "tab-active" : ""}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
