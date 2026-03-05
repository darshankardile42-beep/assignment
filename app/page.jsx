



"use client";
import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";


if (typeof window !== "undefined") {
  import("cally");
}

const Page = () => {

  const [intextofheaderdiv, setintextofheaderdiv] = useState(null);
  const [indexofdu, setindexofdu] = useState(0);
  const [selecdate, setselecdate] = useState(null);
  const [calenderhide, setcalenderhide] = useState(false);
  const [valueofperiod, setvalueofperiod] = useState(null);
  const [indexmatch, setindexmatch] = useState(null);
  const [fourdivBor, setfourdivBor] = useState(null);
  const [addinfo, setaddinfo] = useState(false);
  const [idfordelete, setidfordelete] = useState("");
  const [zerocheck, setzerocheck] = useState(false);
  const [foudivsvalue, setfoudivsvalue] = useState("");
  const [converselecttoday, setconverselecttoday] = useState(null);
  const [statusdrop, setstatusdrop] = useState(null);
  const [finalarr, setfinalarr] = useState([]);
  const [paytypedrop, setpaytypedrop] = useState(null);
  const [penddingarr, setpenddingarr] = useState([]);
  const [partialarr, setpartialarr] = useState([]);
  const [failedarr, setfailedarr] = useState([]);
  const [paidarr, setpaidarr] = useState([]);
  const [allreq, setallreq] = useState([]);
  const [cusorpre, setcusorpre] = useState(null);


  const date = useRef(null);
  const numvalue = useRef("");
  const namevalue = useRef("");
  const Amdue = useRef("");
  const Ampaid = useRef("");

  const currDate = dayjs(new Date()).format("YYYY/MM/DD");


  useEffect(() => {
    if (selecdate) {
      setconverselecttoday(
        dayjs(selecdate?.split("/").join("-")).diff(dayjs(new Date()), "day")
      );
    }
  }, [selecdate]);

  function addinfoproceed() {
    if (numvalue.current.value.trim() === "") {
      toast.error("Fill the contact number field it cannot be empty! ");
      return;
    } else if (namevalue.current.value.trim() === "") {
      toast.error("Fill the name field it cannot be empty! ");
      return;
    } else if (Amdue.current.value.trim() === "") {
      toast.error("Fill the amount due field it cannot be empty! ");
      return;
    } else if (Ampaid.current.value.trim() === "") {
      toast.error("Fill the amount paid field it cannot be empty! ");
      return;
    }

    if (valueofperiod === "Custom") setcusorpre(converselecttoday);
    else setcusorpre(valueofperiod);

    const drop1 = paytypedrop ?? "None";
    const drop2 = statusdrop ?? "pending";
    const randomid = crypto.randomUUID().split("-")[4];
    const period = valueofperiod === "Custom" ? converselecttoday : valueofperiod;
    const futuredatebyadd = dayjs().add(period || 0, "day").format("YYYY/MM/DD");

    const payload = {
      id: randomid,
      fullname: namevalue.current.value,
      contactNo: numvalue.current.value,
      due: Amdue.current.value,
      paid: Ampaid.current.value,
      paymenttype: drop1,
      state: drop2,
      startdate: currDate,
      duedate: futuredatebyadd,
    };

    if (drop2 === "pending") setpenddingarr((prev) => [...prev, payload]);
    else if (drop2 === "partial") setpartialarr((prev) => [...prev, payload]);
    else if (drop2 === "paid") setpaidarr((prev) => [...prev, payload]);
    else if (drop2 === "failed") setfailedarr((prev) => [...prev, payload]);
    
    setaddinfo(false);
  }

  useEffect(() => {
    if (finalarr.length === 0) setzerocheck(true);
    else setzerocheck(false);
  }, [finalarr]);

  useEffect(() => {
    if (foudivsvalue === "Pending") setfinalarr(penddingarr);
    else if (foudivsvalue === "Partial") setfinalarr(partialarr);
    else if (foudivsvalue === "Paid") setfinalarr(paidarr);
    else if (foudivsvalue === "Failed") setfinalarr(failedarr);
    else if (foudivsvalue === "All Requests") setfinalarr(allreq);
  }, [penddingarr, partialarr, paidarr, failedarr, foudivsvalue, allreq]);

  useEffect(() => {
    setallreq([...penddingarr, ...partialarr, ...failedarr, ...paidarr]);
  }, [penddingarr, partialarr, failedarr, paidarr, idfordelete]);

  function deletereq() {
    const assured = confirm("Are you sure you want to delete this request give confirmation twice to avoid accidental deletation ");
    if (!assured) return;
    setpenddingarr((p) => p.filter((o) => o.id !== idfordelete));
    setpartialarr((p) => p.filter((o) => o.id !== idfordelete));
    setfailedarr((p) => p.filter((o) => o.id !== idfordelete));
    setpaidarr((p) => p.filter((o) => o.id !== idfordelete));
  }

  useEffect(() => {
    const handleChange = () => setselecdate(date.current.value);
    const el = date.current;
    el?.addEventListener("change", handleChange);
    return () => el?.removeEventListener("change", handleChange);
  }, [calenderhide]);


  const fourdivs = ["All Requests", "Pending", "Partial", "Paid", "Failed"];
  const headerdivs = ["PayCollect", "⬛ Dashboard", " 💳 Collect Payments", "👥 Customers", "📊 Reports", "🔔", "Maria A."];
  const durationarr = [
    { value: 1, day: "Today" }, { value: 7, day: "Days" }, { value: 30, day: "Days" },
    { value: 90, day: "Days" }, { value: 6, day: "Months" }, { value: 1, day: "Year" },
    { value: "Custom", day: converselecttoday },
  ];


  const parts = currDate.split("/");
  const day = Number(parts[2]) + 1;
  const minDate = `${parts[0]}-${parts[1]}-${day < 10 ? "0" + day : day}`;
  const maxDate = `${Number(parts[0]) + 1}-01-01`;

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      <div className="bg-[#0F3460] w-full min-h-[60px] flex flex-wrap gap-4 items-center justify-center px-4 py-2 sticky top-0 z-[100]">
        {headerdivs.map((i, ind) => (
          <div
            key={ind}
            className={`cursor-pointer transition-colors hover:text-yellow-400 text-sm md:text-base 
              ${i === "PayCollect" ? "text-white font-black" : "text-[#A8B4D0]"}
              ${indexmatch === ind ? "text-white border-b-2 border-yellow-300 font-black" : ""}`}
            onClick={(e) => {
              setindexmatch(ind);
              if (i !== "PayCollect") setintextofheaderdiv(e.target.innerText);
            }}
          >
            {i}
          </div>
        ))}
      </div>


      <div className="max-w-7xl mx-auto p-4 md:p-8">
        

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="text-xl font-black text-black">
            {intextofheaderdiv ?? "💳 Collect Payments"}
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="bg-gray-200 px-4 py-2 rounded font-bold text-xs md:text-sm hover:bg-gray-300">⬆ Upload Excel</button>
            <button 
              className="bg-red-400 px-4 py-2 rounded font-bold text-xs md:text-sm text-white hover:bg-red-500"
              onClick={() => setaddinfo(true)}
            >
              + Save new Request
            </button>
          </div>
        </div>


        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-black text-gray-400">Time Period:</span>
            {durationarr.map((i, ind) => (
              <div
                key={ind}
                className={`cursor-pointer rounded-full px-4 py-1 text-xs md:text-sm font-bold transition
                  ${indexofdu === ind ? "bg-[#0F3460] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => {
                  setindexofdu(ind);
                  setcalenderhide(i.value === "Custom");
                  setvalueofperiod(i.value);
                  if(i.value === "Custom") toast.success("Please select date if not");
                }}
              >
                {i.value} {i.day}
              </div>
            ))}
          </div>


          <div className="bg-gray-100 p-4 rounded-xl flex flex-col md:flex-row md:items-center gap-4 relative">
             <div onClick={() => setcalenderhide(true)} className="cursor-pointer font-bold text-sm">
                <span className="text-gray-500 mr-2">Custom:</span>
                {currDate.split("/").join("-")} → {selecdate ?? "Select date"} 🗓
                <div className="text-gray-400 text-[10px]">Min: 1 day · Max: 1 year</div>
             </div>
             
             <div className="flex flex-wrap items-center gap-2 text-xs">
                <span>📅 Showing data for:</span>
                <div className="bg-pink-100 text-red-500 rounded-full px-3 py-1 border border-red-200">
                  {dayjs(currDate).format("DD MMM YYYY")} - {dayjs(selecdate).format("DD MMM YYYY") === "Invalid Date" ? "Select date" : dayjs(selecdate).format("DD MMM YYYY")}
                  ({dayjs(selecdate?.split("/").join("-")).diff(dayjs(new Date()), "day") || 0} days)
                </div>
                <span className="text-gray-400 italic">Stats and table reflect requests created within this period.</span>
             </div>


             {calenderhide && (
                <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 z-[110]">
                  <calendar-date
                    className="cally bg-white border border-gray-300 shadow-2xl rounded-lg p-2"
                    ref={date}
                    min={minDate}
                    max={maxDate}
                  >
                    <calendar-month></calendar-month>
                    <div
                      onClick={() => setcalenderhide(false)}
                      className="bg-black text-white w-full cursor-pointer py-1 mt-2 text-center rounded font-black text-sm"
                    >
                      Save
                    </div>
                  </calendar-date>
                </div>
              )}
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="bg-gray-200 p-4 rounded-2xl min-h-[100px] flex flex-col justify-center">
              <div className="text-2xl font-black text-blue-950">{finalarr.length}</div>
              <div className="text-xs font-bold text-gray-600">Total Requests</div>
            </div>
            <div className="bg-gray-200 p-4 rounded-2xl min-h-[100px] flex flex-col justify-center">
              <div className="text-2xl font-black text-[#856404]">{penddingarr.length}</div>
              <div className="text-xs font-bold text-gray-600">Pending</div>
            </div>
            <div className="bg-gray-200 p-4 rounded-2xl min-h-[100px] flex flex-col justify-center">
              <div className="text-2xl font-black text-[#084298]">{partialarr.length}</div>
              <div className="text-xs font-bold text-gray-600">Partial Payments</div>
            </div>
            <div className="bg-gray-200 p-4 rounded-2xl min-h-[100px] flex flex-col justify-center">
              <div className="text-2xl font-black text-[#0A3622]">{paidarr.length}</div>
              <div className="text-xs font-bold text-gray-600">Fully Paid</div>
            </div>
            <div className="bg-gray-200 p-4 rounded-2xl min-h-[100px] flex flex-col justify-center">
              <div className="text-2xl font-black text-[#842029]">{failedarr.length}</div>
              <div className="text-xs font-bold text-gray-600">Failed / Expired</div>
            </div>
            <div className="bg-gray-200 p-4 rounded-2xl min-h-[100px] flex flex-col justify-center border-2 border-blue-900">
              <div className="text-2xl font-black text-[#0F3460]">₹ {finalarr.reduce((acc, item) => acc + Number(item.due), 0)}</div>
              <div className="text-xs font-bold text-gray-600">Total Outstanding</div>
            </div>
          </div>


          <div className="flex flex-wrap gap-6 md:gap-10 border-b-2 border-gray-100 pb-2">
            {fourdivs.map((i, ind) => (
              <div
                key={ind}
                className={`cursor-pointer text-base md:text-lg font-medium transition-all ${fourdivBor === ind ? "text-blue-600 border-b-4 border-red-500" : "text-gray-400"}`}
                onClick={(e) => {
                  setfourdivBor(ind);
                  setfoudivsvalue(e.target.innerText);
                }}
              >
                {i}
              </div>
            ))}
          </div>


          <div className="bg-gray-200 rounded-xl overflow-hidden shadow-inner">
            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                {/* Table Header */}
                <div className="grid grid-cols-9 gap-2 items-center text-center p-4 font-bold text-xs text-gray-600 border-b border-gray-300">
                  <div>REFERENCE ID</div>
                  <div>CUSTOMER</div>
                  <div>AMOUNT DUE</div>
                  <div>AMOUNT PAID</div>
                  <div>PAYMENT TYPE</div>
                  <div>STATUS</div>
                  <div>SEND ON</div>
                  <div>DUE DATE</div>
                  <div>ACTION</div>
                </div>

  
                <div className="max-h-[500px] overflow-y-auto">
                  {zerocheck && finalarr.length === 0 && (
                    <div className="p-20 text-center text-xl font-bold text-gray-400">
                      Zero request found in {foudivsvalue} section
                    </div>
                  )}

                  {finalarr.map((i) => (
                    <div key={i.id} className="grid grid-cols-9 gap-2 h-16 items-center text-center text-sm border-b border-gray-100 hover:bg-gray-100 transition">
                      <div className="font-mono text-[10px] truncate px-1">{i.id}</div>
                      <div className="leading-tight">
                        <div className="font-bold truncate">{i.fullname}</div>
                        <div className="text-[10px] text-gray-500">{i.contactNo}</div>
                      </div>
                      <div className="font-bold">₹ {i.due}</div>
                      <div className="font-bold">₹ {i.paid}</div>
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold 
                          ${i.paymenttype === "full-payment" ? "bg-green-200 text-green-700" : 
                            i.paymenttype === "part-payment" ? "bg-blue-300 text-blue-700" : ""}`}>
                          {i.paymenttype}
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold capitalize
                          ${i.state === "pending" ? "bg-amber-200 text-amber-800" : 
                            i.state === "partial" ? "bg-blue-300 text-blue-700" :
                            i.state === "paid" ? "bg-green-200 text-green-700" :
                            i.state === "failed" ? "bg-red-200 text-red-500" : ""}`}>
                          {i.state}
                        </span>
                      </div>
                      <div>{i.startdate}</div>
                      <div className="text-red-600 font-bold">{i.duedate}</div>
                      <div className="flex justify-center">
                        <button
                          className="bg-red-500 text-white text-[10px] py-1 px-3 rounded font-bold hover:bg-red-600 transition"
                          onClick={() => {
                            setidfordelete(i.id);
 
                            setTimeout(deletereq, 10);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {addinfo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4">
          <div className="bg-blue-400 w-full max-w-lg rounded-2xl shadow-2xl p-6 md:p-10 relative overflow-y-auto max-h-[90vh]">
            <button 
              className="absolute top-4 right-4 text-white font-bold"
              onClick={() => setaddinfo(false)}
            >✕</button>
            <h2 className="text-center font-bold mb-8">Additional Information for New Request</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="text-xs font-bold mb-1">Number:</label>
                <input ref={numvalue} type="number" placeholder="+91..." className="bg-transparent border-b-2 border-white focus:outline-none placeholder:text-blue-100" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold mb-1">Name:</label>
                <input ref={namevalue} placeholder="Full name" className="bg-transparent border-b-2 border-white focus:outline-none placeholder:text-blue-100" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold mb-1">Amount Due:</label>
                <input ref={Amdue} type="number" placeholder="0.00" className="bg-transparent border-b-2 border-white focus:outline-none placeholder:text-blue-100" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold mb-1">Amount Paid:</label>
                <input ref={Ampaid} type="number" placeholder="0.00" className="bg-transparent border-b-2 border-white focus:outline-none placeholder:text-blue-100" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold mb-1">Payment Type:</label>
                  <select className="p-1 rounded text-sm" onChange={(e) => setpaytypedrop(e.target.value)}>
                    <option value="none">None</option>
                    <option value="part-payment">Part-payment</option>
                    <option value="full-payment">Full-payment</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold mb-1">Status:</label>
                  <select className="p-1 rounded text-sm" onChange={(e) => setstatusdrop(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3 rounded-xl transition-colors mt-4"
                onClick={addinfoproceed}
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
