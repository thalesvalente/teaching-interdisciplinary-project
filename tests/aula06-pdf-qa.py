"""Confere o conteúdo dos PDFs baixados pela suíte de navegadores.

Requer pdfplumber. Uso: python tests/aula06-pdf-qa.py tmp/aula06-qa
Verifica texto real, pontuação, pendências, integridade de resposta longa e limites
da página. A inspeção visual da paginação continua sendo uma etapa separada.
"""
import json
import re
import sys
from pathlib import Path

import pdfplumber

EXPECTATIONS = {
    "aula-vazia.pdf": (0, 5),
    "aula-parcial.pdf": (20, 3),
    "aula-completa.pdf": (100, 0),
    "ficha-vazia.pdf": (0, 26),
    "ficha-parcial.pdf": (16, 21),
    "ficha-completa.pdf": (100, 0),
    "ficha-longa.pdf": (96, 1),
    "ficha-offline.pdf": (96, 1),
    "aula-impressao-parcial.pdf": (80, 1),
    "ficha-impressao-parcial.pdf": (16, 21),
    "aula-completa-parcial.pdf": (20, 3),
    "ficha-texto-longo.pdf": (10, 24),
}


def inspect(file):
    match = next((value for suffix, value in EXPECTATIONS.items()
                  if file.name.endswith(suffix)), None)
    if match is None:
        return None
    expected_xp, expected_pending = match
    with pdfplumber.open(file) as pdf:
        text = " ".join(" ".join((page.extract_text() or "").split()) for page in pdf.pages)
        assert re.search(rf"\b{expected_xp}\s*/\s*100\s*XP\b", text), f"{file.name}: XP divergente"
        assert re.search(rf"\b{expected_pending}\s+pendentes\b", text), f"{file.name}: pendências divergentes"
        assert "AULA 05 · REGISTRO DO CAMINHO DA INFORMAÇÃO" not in text, f"{file.name}: cabeçalho antigo"
        if file.name.endswith("ficha-longa.pdf"):
            assert "MARCADOR_FINAL_LONGO" in text, f"{file.name}: resposta truncada"
        outside = sum(1 for page in pdf.pages for char in page.chars
                      if char["x0"] < -1 or char["x1"] > page.width + 1
                      or char["top"] < -1 or char["bottom"] > page.height + 1)
        assert outside == 0, f"{file.name}: {outside} caracteres fora da página"
        return {"file": file.name, "status": "PASS", "pages": len(pdf.pages),
                "earned": expected_xp, "max": 100, "pending": expected_pending,
                "charactersOutsidePage": outside, "selectableText": True}


def main():
    directories = [Path(p) for p in sys.argv[1:]] or [Path("tmp/aula06-qa")]
    results = []
    for directory in directories:
        for file in sorted(directory.glob("*.pdf")):
            result = inspect(file)
            if result is not None:
                results.append(result)
    if not results:
        raise SystemExit("Nenhum PDF de teste encontrado. Execute primeiro npm run test:aula06.")
    report = {"summary": {"pass": len(results), "fail": 0}, "reports": results}
    output = directories[0] / "pdf-qa.json"
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"summary": report["summary"], "report": str(output)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
