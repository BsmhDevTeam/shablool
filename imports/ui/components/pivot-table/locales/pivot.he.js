(function() {
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    var c3r, d3r, frFmt, frFmtInt, frFmtPct, gcr, nf, r, tpl;
    nf = $.pivotUtilities.numberFormat;
    tpl = $.pivotUtilities.aggregatorTemplates;
    r = $.pivotUtilities.renderers;
    gcr = $.pivotUtilities.gchart_renderers;
    d3r = $.pivotUtilities.d3_renderers;
    c3r = $.pivotUtilities.c3_renderers;
    frFmt = nf({
      thousandsSep: ",",
      decimalSep: "."
    });
    frFmtInt = nf({
      digitsAfterDecimal: 0,
      thousandsSep: ",",
      decimalSep: "."
    });
    frFmtPct = nf({
      digitsAfterDecimal: 2,
      scaler: 100,
      suffix: "%",
      thousandsSep: ",",
      decimalSep: "."
    });
    $.pivotUtilities.locales.he = {
      localeStrings: {
        renderError: "אירעה שגיאה במהלך עיבוד ה- PivotTable.",
        computeError: "ארעה שגיאה במהלך החישוב של PivotTable.",
        uiRenderError: "ארעה שגיאה בזמן עיבוד של PivotTable.",
        selectAll: "בחר את הכל",
        selectNone: "אל תבחר כלום",
        tooMany: "(ערכים רבים מידי)",
        filterResults: "תוצאות סינון",
        totals: "הכל",
        vs: "של",
        by: "לפי"
      },
      aggregators: {
        "כמות": tpl.count(frFmtInt),
        "כמות ערכים ייחודיים": tpl.countUnique(frFmtInt),
        "רשימת ערכים יחודיים": tpl.listUnique(", "),
        "סכום": tpl.sum(frFmt),
        "סכום שלם": tpl.sum(frFmtInt),
        "ממוצע": tpl.average(frFmt),
        "מינימום": tpl.min(frFmt),
        "מקסימום": tpl.max(frFmt),
        "סכום על סכום": tpl.sumOverSum(frFmt),
        "סכום מעל 80%": tpl.sumOverSumBound80(true, frFmt),
        "סכום מתחת 80%": tpl.sumOverSumBound80(false, frFmt),
        "סכום כחלק מהכל": tpl.fractionOf(tpl.sum(), "total", frFmtPct),
        "סכום כחלק מהשורות": tpl.fractionOf(tpl.sum(), "row", frFmtPct),
        "סכום כחלק מהעמודות": tpl.fractionOf(tpl.sum(), "col", frFmtPct),
        "כמות כוללת": tpl.fractionOf(tpl.count(), "total", frFmtPct),
        "כמות שורות": tpl.fractionOf(tpl.count(), "row", frFmtPct),
        "כמות עמודות": tpl.fractionOf(tpl.count(), "col", frFmtPct)
      },
      renderers: {
        "טבלה": $.pivotUtilities.renderers["Table"],
        "טבלת עמודות": $.pivotUtilities.renderers["Table Barchart"],
        "מפת חום": $.pivotUtilities.renderers["Heatmap"],
        "טבלת חום לפי שורות": $.pivotUtilities.renderers["Row Heatmap"],
        "טבלת חום לפי עמודות": $.pivotUtilities.renderers["Col Heatmap"]
      }
    };
    if (c3r) {
      $.pivotUtilities.c3_renderers = {
        "טבלה": $.pivotUtilities.renderers["Table"],
        "טבלת עמודות": $.pivotUtilities.renderers["Table Barchart"],
        "מפת חום": $.pivotUtilities.renderers["Heatmap"],
        "טבלת חום לפי שורות": $.pivotUtilities.renderers["Row Heatmap"],
        "טבלת חום לפי עמודות": $.pivotUtilities.renderers["Col Heatmap"],
        "גרף לינארי": c3r["Line Chart"],
        "גרף עמודות": c3r["Bar Chart"],
        "תרשים עמודות מוערמות": c3r["Stacked Bar Chart"],
        "תרשים שטח": c3r["Area Chart"],
        "תרשים פיזור": c3r["Scatter Chart"]
      };
      $.pivotUtilities.locales.he.renderers = $.extend($.pivotUtilities.locales.he.renderers, $.pivotUtilities.c3_renderers);
    }
    if (gcr) {
      $.pivotUtilities.locales.he.gchart_renderers = {
        "גרף לינארי": gcr["Line Chart"],
        "גרף עמודות": gcr["Bar Chart"],
        "תרשים עמודות מוערמות": gcr["Stacked Bar Chart"],
        "תרשים שטח": gcr["Area Chart"]
      };
      $.pivotUtilities.locales.he.renderers = $.extend($.pivotUtilities.locales.he.renderers, $.pivotUtilities.locales.he.gchart_renderers);
    }
    if (d3r) {
      $.pivotUtilities.locales.he.d3_renderers = {
        "תרשים פיזור": d3r["Treemap"]
      };
      $.pivotUtilities.locales.he.renderers = $.extend($.pivotUtilities.locales.he.renderers, $.pivotUtilities.locales.he.d3_renderers);
    }

    return $.pivotUtilities.locales.he;
  });

}).call(this);

//# sourceMappingURL=‏‏pivot.he.js.map
