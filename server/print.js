import { Printer } from "@node-escpos/core";
import USB from "@node-escpos/usb-adapter";


export function printTicket(date, name, price) {
  const device = new USB();

  device.open(async function(err){
    if(err){
      return
    }

    const options = { encoding: "GB18030" /* default */ }
    let printer = new Printer(device, options);

    printer
      // .font("A")
      .size(1, 1)
      .align("LT")
      .text(`${date}\n`)
      .size(2, 2)
      .align("CT")
      .style("B")
      .text(name)
      .size(1, 1)
      .align("RT")
      .style("NORMAL")
      .text(`${price}円\n\n`)
      .size(1, 1)
      .align("RT")
      .style("NORMAL")
      .text("HIU食堂 Web券売機")

    printer
      .cut()
      .close()
  });

}
