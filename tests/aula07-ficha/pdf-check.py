"""Validate actual browser-produced A4 PDFs; visual review remains a separate gate.

Usage: python3 tests/aula07-ficha/pdf-check.py tmp/aula07-ficha-qa
All PDF input is synthetic. The script writes its structured evidence next to PDFs.
"""
import json
import re
import sys
from pathlib import Path

import pdfplumber

NOTICE = (
    "Pontuação automática de completude e processo. A qualidade técnica e ética "
    "permanece sujeita à revisão docente."
)


def normalize(value):
    return " ".join(value.split())


def inspect(file):
    with pdfplumber.open(file) as pdf:
        pages = [normalize(page.extract_text() or "") for page in pdf.pages]
        assert all(pages), f"{file.name}: blank/unlabelled trailing page: {[i + 1 for i, text in enumerate(pages) if not text]}"
        text = " ".join(pages)
        assert len(text) > 1000, f"{file.name}: PDF without essential selectable text"
        assert NOTICE in text, f"{file.name}: mandatory assessment notice missing"
        assert "PPI1-3B" in text, f"{file.name}: official-grade separation missing"
        assert "Aula 08" in text, f"{file.name}: formal requirements boundary missing"
        assert "revisão" in text.lower(), f"{file.name}: review status missing"
        if "filled" in file.name:
            assert re.search(r"\b100\s*(?:/|de)\s*100", text), f"{file.name}: maximum score missing"
            assert "QA_FINAL_EVIDENCE_MARKER" in text, f"{file.name}: last evidence truncated"
        if "partial" in file.name:
            assert "penden" in text.lower() or "pendên" in text.lower(), f"{file.name}: pending criteria missing"
            assert "QA_PARTIAL_RESPONSE_MARKER" in text, f"{file.name}: partial answer missing"
        if "blank" in file.name:
            assert "QA_PARTIAL_RESPONSE_MARKER" not in text, f"{file.name}: blank report leaks prior content"
            assert "QA_FINAL_EVIDENCE_MARKER" not in text, f"{file.name}: blank report leaks complete content"
        if "long" in file.name:
            assert "QA_LONG_TEXT_END" in text, f"{file.name}: long answer truncated at a page boundary"
        outside = []
        overlaps = []
        for number, page in enumerate(pdf.pages, 1):
            assert abs(page.width - 595.28) < 2 and abs(page.height - 841.89) < 2, (
                f"{file.name}: page {number} is not A4 portrait: {page.width}x{page.height}"
            )
            for char in page.chars:
                if char["x0"] < -1 or char["x1"] > page.width + 1 or char["top"] < -1 or char["bottom"] > page.height + 1:
                    outside.append({"page": number, "char": char["text"]})
            # Different glyphs occupying the same position signal duplicated/overlaid print layers.
            positions = {}
            for char in page.chars:
                if not char["text"].strip():
                    continue
                position = (round(char["x0"], 1), round(char["top"], 1))
                if position in positions and positions[position] != char["text"]:
                    overlaps.append({"page": number, "position": position})
                positions[position] = char["text"]
        assert not outside, f"{file.name}: characters outside page: {outside[:10]}"
        assert not overlaps, f"{file.name}: coincident text layers: {overlaps[:10]}"
        return {"file": file.name, "status": "PASS", "pages": len(pdf.pages),
                "selectableCharacters": len(text), "charactersOutsidePage": 0,
                "coincidentTextLayers": 0, "pageSize": "A4 portrait"}


def main():
    directory = Path(sys.argv[1] if len(sys.argv) > 1 else "tmp/aula07-ficha-qa")
    files = sorted(directory.glob("ficha-*.pdf"))
    if not files:
        raise SystemExit("BLOCKED: no browser-produced ficha-*.pdf files found")
    results = []
    for file in files:
        try:
            results.append(inspect(file))
        except (AssertionError, Exception) as error:
            results.append({"file": file.name, "status": "FAIL", "error": str(error)})
    report = {"summary": {"pass": sum(r["status"] == "PASS" for r in results),
                          "fail": sum(r["status"] == "FAIL" for r in results)}, "results": results,
              "limit": "Automated geometry/text checks do not replace rendered visual inspection."}
    (directory / "pdf-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False))
    if report["summary"]["fail"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
